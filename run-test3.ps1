# Test amount tampering with real Stripe ID format
$body = @'
{
  "paymentIntentId": "pi_3RealStripeId123456",
  "orderSummary": {
    "total": "1.00",
    "items": [
      {
        "id": 1,
        "name": "Test",
        "price": 1.00,
        "quantity": 1,
        "total": "1.00"
      }
    ],
    "subtotal": "1.00",
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
