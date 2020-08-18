@app
begin-app

@static
folder build

@http
get /api
post /upload-image

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
