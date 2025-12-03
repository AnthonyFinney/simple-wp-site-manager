<?php

namespace App\Services;

use App\Models\Server;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;

class SshClient
{
    public function __construct(
        protected ?bool $dryRun = null,
        protected ?int $timeout = null,
        protected ?int $connectTimeout = null
    ) {
        $this->dryRun = $dryRun ?? (bool) config('services.ssh.dry_run', true);
        $this->timeout = $timeout ?? (int) config('services.ssh.timeout', 60);
        $this->connectTimeout = $connectTimeout ?? (int) config('services.ssh.connect_timeout', 15);
    }

    public function run(Server $server, string $command): array
    {
        $isDryRun = $this->dryRun;

        if ($isDryRun) {
            Log::info('SSH command (stub)', [
                'server' => $server->id,
                'host' => $server->host,
                'user' => $server->ssh_user,
                'command' => $command,
                'dry_run' => $isDryRun,
            ]);

            return [
                'exit_code' => 0,
                'output' => '[stub] command not executed; enable real SSH when ready.',
            ];
        }

        $tempKey = null;
        $processOutput = '';
        $exitCode = 1;

        $sshBinary = config('services.ssh.binary', 'ssh');
        $args = [
            $sshBinary,
            '-o',
            'StrictHostKeyChecking=no',
            // BatchMode=yes blocks password prompts; only enable when we are not using password auth.
            '-o',
            $server->ssh_auth_type === 'password' ? 'BatchMode=no' : 'BatchMode=yes',
            '-p',
            (string) ($server->ssh_port ?: 22),
            '-o',
            'ConnectTimeout=' . $this->connectTimeout,
        ];

        if ($server->ssh_private_key) {
            $tempKey = $this->writeTempKey($server->ssh_private_key);
            $args[] = '-i';
            $args[] = $tempKey;
        }

        if ($server->ssh_auth_type === 'password' && $server->ssh_password) {
            $sshpass = (new ExecutableFinder())->find('sshpass');
            if ($sshpass) {
                array_unshift($args, $sshpass, '-p', $server->ssh_password);
            } else {
                Log::warning('sshpass not available; password auth may fail', [
                    'server' => $server->id,
                    'host' => $server->host,
                ]);
            }
        }

        $target = ($server->ssh_user ?: 'root') . '@' . $server->host;
        $args[] = $target;
        $args[] = $command;

        $process = new Process($args);
        $process->setTimeout($this->timeout);

        try {
            $process->run();
            $processOutput = $process->getOutput() . $process->getErrorOutput();
            $exitCode = $process->getExitCode();
        } catch (\Throwable $e) {
            $processOutput = $e->getMessage();
            $exitCode = 1;
        } finally {
            if ($tempKey && file_exists($tempKey)) {
                @unlink($tempKey);
            }
        }

        Log::info('SSH command executed', [
            'server' => $server->id,
            'host' => $server->host,
            'user' => $server->ssh_user,
            'command' => $command,
            'exit_code' => $exitCode,
            'dry_run' => $isDryRun,
        ]);

        return [
            'exit_code' => $exitCode,
            'output' => trim($processOutput),
        ];
    }

    protected function writeTempKey(string $keyContents): string
    {
        $path = tempnam(sys_get_temp_dir(), 'ssh-key-');
        file_put_contents($path, $keyContents);
        @chmod($path, 0600);

        return $path;
    }
}
