# Test fake ID rejection in production mode
$body = @'
{
  "paymentIntentId": "FAKE-123",
  "orderSummary": {
    "total": "29.99",
    "items": [
      {
        "id": 1,
        "name": "Test",
        "price": 29.99,
        "quantity": 1,
        "total": "29.99"
      }
    ],
    "subtotal": "29.99",
    "shipping": "0.00"
  }
}
'@

try {
    $resp = Invoke-RestMethod -Uri "http://localhost:4242/confirm-payment" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 10
    Write-Host "RESPONSE: $($resp | ConvertTo-Json -Depth 3)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $errorBody = $reader.ReadToEnd()
        Write-Host "ERROR BODY: $errorBody"
    }
}
