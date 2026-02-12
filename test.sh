stream=false

if [ "$stream" = true ]; then
  accept_header='Accept: text/event-stream'
else
  accept_header='Accept: application/json'
fi

echo '{
  "model": "moonshotai/kimi-k2.5",
  "messages": [{"role":"user","content":""}],
  "max_tokens": 16384,
  "temperature": 1.00,
  "top_p": 1.00,
  "stream": false
}' >payload.json

curl https://integrate.api.nvidia.com/v1/chat/completions \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -H "$accept_header" \
  -d @payload.json
