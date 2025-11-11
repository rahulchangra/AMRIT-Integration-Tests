$start = Get-Date
Write-Host "Starting Full AMRIT Workflow in DEBUG mode at $($start.ToString('HH:mm:ss'))`n"

$env:HEADLESS = "false"
$env:PWDEBUG = "1"
$env:BROWSER = "chromium"

function Run-Step($name, $path) {
    $stepStart = Get-Date
    Write-Host "Running $name..."
    npx playwright test $path --project=chromium --headed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "$name failed. Stopping execution."
        exit $LASTEXITCODE
    }
    $stepEnd = Get-Date
    $duration = [math]::Round(($stepEnd - $stepStart).TotalSeconds, 2)
    Write-Host "$name completed in $duration seconds.`n"
}

Run-Step "Registration"      "tests/aam/authentication/registration.spec.js"
Run-Step "Nurse"             "tests/aam/authentication/nurse.spec.js"
Run-Step "Doctor"            "tests/aam/authentication/doctor.spec.js"
Run-Step "Lab Technician"    "tests/aam/authentication/labtech.spec.js"
Run-Step "Doctor Verification" "tests/aam/authentication/doctor.verify.spec.js"

$end = Get-Date
$total = [math]::Round(($end - $start).TotalSeconds, 2)
Write-Host "All modules executed successfully in $total seconds."
Write-Host ""
Write-Host "Opening Playwright Report..."
npx playwright show-report
