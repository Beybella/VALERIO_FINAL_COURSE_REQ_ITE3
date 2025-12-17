<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BillingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void 
    {
        $file = fopen(base_path("database/data/Synthetic AR Medical Dataset with Realistic Denial.csv"), "r");
        $firstline = true;

        while (($data = fgetcsv($file, 2000, ",")) !== FALSE) {
            if ($firstline) {
                $firstline = false;
                continue;
            }

            // We use create() here because 200 rows will process almost instantly
            \App\Models\Billing::create([
                'insurance_provider' => $data[8],  // Insurance Name column
                'claim_billing_date' => $data[7],  // Submitted Date column
                'billed_amount'      => (float) $data[10], // Billed Amount
                // Paid Amount = Billed Amount - Balance Amount (Data[11])
                'paid_amount'        => (float) $data[10] - (float) $data[11], 
                'claim_status'       => $data[9],  // Status (Denied, Pending, etc.)
            ]);
        }
        
        fclose($file);
    }
}
