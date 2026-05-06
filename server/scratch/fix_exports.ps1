$filePath = "c:\Users\erani\Desktop\YourInterViewCoach-04-May-2026\Your-Interview-Coach\server\services\domain\bookingService.js"
$content = Get-Content $filePath -Raw

# Fix the first named export block (around line 887-903)
$old1 = "  getMentorStudentsList,`r`n  getStudentBookings,"
$new1 = "  getMentorStudentsList,`r`n  getMentorAllBookings,`r`n  getStudentBookings,"
$content = $content.Replace($old1, $new1)

Set-Content $filePath -Value $content -NoNewline
Write-Host "Done. Occurrences replaced."
