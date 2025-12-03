<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SiteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $siteId = $this->route('site') ?? $this->route('id');

        return [
            'server_id' => ['required', 'exists:servers,id'],
            'domain' => ['required', 'string', 'max:255', 'unique:sites,domain,' . $siteId],
            'container_name' => ['nullable', 'string', 'max:255'],
            'project_path' => ['nullable', 'string', 'max:255'],
            'docker_image' => ['nullable', 'string', 'max:255'],
            'php_version' => ['nullable', 'string', 'max:25'],
            'status' => ['sometimes', 'in:running,stopped,deploying,failed'],
            'http_port' => [
                'nullable',
                'integer',
                'between:1,65535',
                Rule::unique('sites', 'http_port')
                    ->where(fn($query) => $query->where('server_id', $this->input('server_id')))
                    ->ignore($siteId),
            ],
            'env_overrides' => ['nullable', 'array'],
            'db_name' => ['nullable', 'string', 'max:191'],
            'db_user' => ['nullable', 'string', 'max:191'],
            'db_password' => ['nullable', 'string', 'max:255'],
            'db_host' => ['nullable', 'string', 'max:191'],
            'db_port' => ['nullable', 'integer', 'between:1,65535'],
            'last_backup_at' => ['nullable', 'date'],
            'last_health_check_at' => ['nullable', 'date'],
            'wp_admin_user' => ['nullable', 'string', 'max:191'],
            'wp_admin_email' => ['nullable', 'email', 'max:191'],
        ];
    }
}
