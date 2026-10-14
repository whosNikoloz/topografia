# Topografia — VPS Deployment Guide

This guide explains what to do after purchasing an Ubuntu VPS. The production build has already been tested successfully with Next.js 16.4.0.

## Important: where the website data is stored

The current project does **not** use a database.

- Services, projects, articles, gallery records, prices, SEO, and settings are stored in `data/content.json`.
- Images and videos uploaded from the Admin panel are stored in `public/uploads` on the server disk.
- The content already present in `data/content.json` is included in the first deployment. You do not need to enter all of it again.
- On a VPS, new Admin-panel changes remain on the VPS disk after an application restart or reboot.
- Deleting the VPS, reinstalling its operating system, or losing its disk will also lose the live content unless backups exist.

### Temporary Vercel preview

The existing `public/uploads` files are included in Git so the current photos and videos can be displayed during a temporary Vercel preview. The content already saved in `data/content.json`, including projects and services, is also included.

The current data-storage implementation is not suitable for permanent Admin-panel editing on Vercel. Its serverless filesystem is not persistent writable storage. During the temporary preview, treat the Admin panel as read-only: Admin changes and new uploads can fail or disappear after a new deployment or function restart.

For the current version, use a VPS with persistent storage. If permanent Vercel hosting is required later, first migrate:

- `data/content.json` to a database such as Supabase Postgres; and
- `public/uploads` to persistent object storage such as Supabase Storage.

Merely setting a Supabase environment variable does not perform this migration. The application code must also be changed to read and write through Supabase.

## What you need

- An Ubuntu VPS
- The VPS IP address
- SSH username and password, or an SSH key
- A domain name (optional, but recommended)
- Access to the domain's DNS settings

## 1. Connect to the VPS

Open PowerShell on your computer and connect to the server:

```bash
ssh root@YOUR_VPS_IP
```

Replace `YOUR_VPS_IP` with the actual server IP address.

## 2. Install the required software

Update Ubuntu and install Git and Nginx:

```bash
apt update
apt upgrade -y
apt install -y nginx git curl
```

Install Node.js 22 LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

Confirm the installation:

```bash
node --version
npm --version
nginx -v
```

Install PM2, which will keep the website running:

```bash
npm install -g pm2
```

## 3. Upload the latest project to GitHub

Before cloning the project on the VPS, run these commands on your own computer:

```bash
git add .
git commit -m "Prepare production deployment"
git push
```

Do not commit or upload `.env.local` to GitHub.

## 4. Clone the project on the VPS

Run these commands on the VPS:

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/whosNikoloz/topografia.git
cd topografia
npm ci
```

If the GitHub repository is private, configure an SSH deploy key or use another secure GitHub authentication method. Do not put a GitHub token directly inside a command or repository URL.

## 5. Configure environment variables

Create the production environment file:

```bash
nano /var/www/topografia/.env.local
```

Add the following variables:

```env
ADMIN_PASSWORD=REPLACE_WITH_A_STRONG_PASSWORD
ADMIN_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
NEXT_PUBLIC_SITE_URL=https://yourdomain.ge
```

If the domain is not connected yet, temporarily use the VPS address:

```env
NEXT_PUBLIC_SITE_URL=http://YOUR_VPS_IP
```

Generate a secure value for `ADMIN_SECRET` with:

```bash
openssl rand -hex 32
```

In Nano, save with `Ctrl+O`, press `Enter`, and exit with `Ctrl+X`.

Protect the environment file:

```bash
chmod 600 /var/www/topografia/.env.local
```

## 6. Upload the existing photos and videos

The existing preview media is currently included in Git so it can be deployed to Vercel and will normally arrive when the VPS repository is cloned. If media is excluded from Git again later, or if newer live media only exists outside the repository, upload it separately using the following steps.

First, ensure that the destination exists. Run on the VPS:

```bash
mkdir -p /var/www/topografia/public/uploads
```

Then exit the VPS SSH session:

```bash
exit
```

In PowerShell on your computer, from the project directory, run:

```powershell
scp -r .\public\uploads\* root@YOUR_VPS_IP:/var/www/topografia/public/uploads/
```

Enter the VPS password when requested. Then connect to the VPS again:

```bash
ssh root@YOUR_VPS_IP
```

Confirm that the files arrived:

```bash
ls -lah /var/www/topografia/public/uploads
```

This separate upload is required only for existing local media. New files uploaded later through the production Admin panel will be written directly to this VPS directory.

## 7. Build and start the website

```bash
cd /var/www/topografia
npm run build
pm2 start npm --name topografia -- start
pm2 save
pm2 startup
```

The last command prints another command. Copy and run that generated command, then run:

```bash
pm2 save
```

Check that the application is running:

```bash
pm2 status
curl http://127.0.0.1:3000
```

## 8. Connect Nginx

Create an Nginx configuration:

```bash
nano /etc/nginx/sites-available/topografia
```

Paste this configuration and replace the domain names:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.ge www.yourdomain.ge;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
    }
}
```

If you do not have a domain yet, use this line instead:

```nginx
server_name YOUR_VPS_IP;
```

Enable the configuration:

```bash
ln -s /etc/nginx/sites-available/topografia /etc/nginx/sites-enabled/topografia
nginx -t
systemctl reload nginx
```

The website should now be accessible at `http://YOUR_VPS_IP` or at the configured domain.

## 9. Connect the domain

In the domain provider's DNS settings, create these records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `YOUR_VPS_IP` |
| A | `www` | `YOUR_VPS_IP` |

DNS changes can take some time to become active.

## 10. Enable free HTTPS

Only run this after the domain points to the VPS and opens over HTTP:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.ge -d www.yourdomain.ge
```

Test automatic certificate renewal:

```bash
certbot renew --dry-run
```

After HTTPS is active, confirm that `.env.local` contains the correct URL:

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.ge
```

If you changed it, rebuild and restart the application:

```bash
cd /var/www/topografia
npm run build
pm2 restart topografia
```

## 11. Deploy future updates

`data/content.json` is tracked by Git, but the live Admin panel also changes that same file on the VPS. Therefore, a normal `git pull` can conflict with live content. Back up the live data before every update.

First, connect to the VPS and create a dated backup:

```bash
mkdir -p /var/backups/topografia
cp /var/www/topografia/data/content.json /var/backups/topografia/content-$(date +%F-%H%M%S).json
tar -czf /var/backups/topografia/uploads-$(date +%F-%H%M%S).tar.gz -C /var/www/topografia/public uploads
```

Check whether the Admin panel has changed the tracked content file:

```bash
cd /var/www/topografia
git status --short data/content.json
```

If `data/content.json` appears as modified, preserve the live version temporarily:

```bash
cp data/content.json /tmp/topografia-live-content.json
git restore data/content.json
```

Next, commit and push the code changes from your own computer. Then update the VPS:

```bash
cd /var/www/topografia
git pull
npm ci
```

If you saved a live content copy in `/tmp`, restore it before building:

```bash
cp /tmp/topografia-live-content.json /var/www/topografia/data/content.json
```

Finish the deployment:

```bash
cd /var/www/topografia
npm run build
pm2 restart topografia
```

Be careful when the same media directory contains both Git-tracked preview files and later Admin uploads. Git does not include new Admin uploads unless they are explicitly committed, so all live media must still be included in backups.

### Recommended long-term improvement

The safer production solution is to migrate the live content and uploads to Supabase. After that migration:

- deployments will not overwrite live data;
- Vercel and VPS deployments can use the same persistent data;
- projects and services will not need to be entered again after a deployment; and
- backups and media storage will be easier to manage.

## Useful commands

Check application status:

```bash
pm2 status
```

View application logs:

```bash
pm2 logs topografia
```

Restart the application:

```bash
pm2 restart topografia
```

Check Nginx configuration:

```bash
nginx -t
```

Reload Nginx:

```bash
systemctl reload nginx
```

## Security checklist

- Use strong values for `ADMIN_PASSWORD` and `ADMIN_SECRET`.
- Never upload `.env.local` to GitHub.
- Do not expose port `3000` publicly; visitors should connect through Nginx.
- Keep Ubuntu and Node.js security updates installed.
- Use SSH keys instead of a root password when possible.
- Keep regular backups of any uploaded files or data stored on the VPS.
- Back up both `data/content.json` and `public/uploads` before every deployment.
