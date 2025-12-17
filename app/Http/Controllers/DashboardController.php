<?php

namespace App\Http\Controllers;

use App\Models\Billing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            // This satisfies the AuthenticatedLayout and prevents the crash
            'auth' => [
                'user' => [
                    'name' => 'Guest Professor',
                ]
            ],
            'chartData' => \App\Models\Billing::all(),
            'stats' => [
                'totalRevenue' => \App\Models\Billing::sum('billed_amount'),
                'badDebt' => \App\Models\Billing::where('claim_status', 'Denied')->sum('billed_amount'),
                'receivables' => \App\Models\Billing::sum('billed_amount') - \App\Models\Billing::sum('paid_amount'),
            ]
        ]);
    }
}