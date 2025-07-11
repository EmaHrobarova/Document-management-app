<?php

use App\Http\Controllers\TagController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocumentController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents', [DocumentController::class, 'store']);
    Route::get('/documents/{id}', [DocumentController::class, 'show']);
    Route::get('/documents/download/{id}', [DocumentController::class, 'download']);
    Route::delete('/documents/delete/{id}', [DocumentController::class, 'delete']);
    Route::put('/documents/update/{id}', [DocumentController::class, 'update']);
    Route::get('/documents/{id}/tags', [DocumentController::class, 'tags']);
    Route::post('/documents/{id}/tags', [DocumentController::class, 'addTag']);
    Route::delete('/documents/{document_id}/tags/{tag_id}', [DocumentController::class, 'deleteTag']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/tags', [TagController::class, 'index']);
    Route::post('/tags', [TagController::class, 'store']);
    Route::delete('/tags/{id}', [TagController::class, 'destroy']);
});

require __DIR__.'/auth.php';
