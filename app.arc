@app
begin-app

@static
folder build

@http
get /api
get /emotion
post /upload-image

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
