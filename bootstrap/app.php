<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
    $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
   
        
        // 2. Tambahkan ini agar API tidak meminta token CSRF halaman web biasa
        $middleware->validateCsrfTokens(except: [
            'api/*' 
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
