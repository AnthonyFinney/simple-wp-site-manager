# Simple WP Site Manager

Laravel + Inertia + React dashboard for managing WordPress sites that run inside Docker containers on remote VPS servers.

## Stack and Features
- Laravel 11 with queues for deploy/stop/destroy jobs (`DeploySiteJob`, `DestroySiteJob`)
- Inertia + React + Tailwind UI for server/site CRUD and status badges (Running, Stopped, Deploying, Failed)
- Docker orchestration via `WordPressDeployer` + `DockerManager`, honoring server SSH/Docker settings and encrypting sensitive fields (SSH keys/passwords, DB passwords)
- Token-protected monitor endpoint (`POST /monitor/sites/{site}`) to receive container health updates

## Local Setup
1) Copy `.env.example` to `.env`, set database credentials, queue connection, `MONITOR_TOKEN`, etc.  
2) Install dependencies: `composer install && npm install`  
3) Build frontend: `npm run dev` (or `npm run build` for production)  
4) Run migrations and seeders: `php artisan migrate --seed` (creates `admin@example.com` / `password`).  
5) Start the app: `php artisan serve`  
6) Sign in at `/login` (or register at `/register` if no users exist).  
7) Set `SSH_DRY_RUN=false` in `.env` when you are ready for real SSH/Docker actions (defaults to dry-run for safety).

## Site Lifecycle
- Creating or updating a site dispatches `DeploySiteJob`, which builds a docker-compose stack (WordPress + MySQL), writes it to the remote server project path, and starts containers via Docker (respecting `docker_bin_path` and `requires_sudo` on the server). Status transitions: Deploying → Running on success, Failed on error, or Stopped when the desired status is set to stopped.
- Deleting a site dispatches `DestroySiteJob` to stop and remove containers.
- Sensitive server/site fields are encrypted at rest via Eloquent casts.
- Each site can set a unique host port (per server) for HTTP to avoid collisions when multiple sites run on the same host; defaults to 80 if left blank.

## Docker Monitor Script (run on the remote server)
1) Copy `scripts/docker-monitor.env.example` to `scripts/docker-monitor.env` and set:
   - `APP_URL`: your Laravel app URL
   - `MONITOR_TOKEN`: the same token set in the app `.env`
   - `SITE_MAP`: comma-separated list like `123:wp-site,124:wp-blog` (optional legacy `SITE_ID` + `CONTAINER_NAME` fallback)
2) Upload `scripts/docker-monitor.sh` and `scripts/run-docker-monitor.sh` to the server and ensure they are executable.
3) Add a cron entry to run every 5 minutes:
   ```
   */5 * * * * /path/to/run-docker-monitor.sh
   ```
4) Logs append to `/var/log/docker-monitor.log`. The script inspects each container, marks it Running/Stopped/Failed, and POSTs to `/monitor/sites/{id}` with the `X-Monitor-Token` header.

## Notes
- `App\Services\SshClient` defaults to dry-run. Set `SSH_DRY_RUN=false` (and optionally `SSH_TIMEOUT`, `SSH_BINARY`) in `.env` to execute real commands.
- Status badges in the UI reflect the four allowed states: running, stopped, deploying, failed.
- Backups now run over SSH using `docker compose exec` to stream DB dumps and wp-content files into zip archives on the app server. A Restore action is available per backup (queued job); ensure your remote Docker project is reachable and SSH credentials are valid before running.
