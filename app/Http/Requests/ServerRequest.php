<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ServerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $serverId = $this->route('server') ?? $this->route('id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'host' => ['required', 'string', 'max:255', 'unique:servers,host,' . $serverId],
            'provider' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:online,offline,maintenance'],
            'os' => ['nullable', 'string', 'max:255'],
            'memory' => ['nullable', 'string', 'max:255'],
            'disk' => ['nullable', 'string', 'max:255'],
            'ip_addresses' => ['nullable', 'array'],
            'ip_addresses.*' => ['ip'],
            'ssh_user' => ['required', 'string', 'max:255'],
            'ssh_port' => ['required', 'integer', 'between:1,65535'],
            'ssh_auth_type' => ['required', 'in:key,password'],
            'ssh_private_key' => ['nullable', 'string'],
            'ssh_password' => ['nullable', 'string'],
            'requires_sudo' => ['boolean'],
            'docker_bin_path' => ['nullable', 'string', 'max:255'],
        ];
    }
}
