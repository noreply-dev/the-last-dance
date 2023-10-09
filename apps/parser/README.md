# PDF-PARSER

```
curl --location --globoff 'https://cristian.protofy.xyz/upload --form 'filePdf=@"/Users/cristian/dev/protofy/auna/input-slices/1.pdf"'
```

### Availables query params
This query params override a default configuration on the server and can be omitted.

#### ignoreOperators: ARRAY
Ignore operators on the filtering process once the pdf has been parsed.
```
....xyz/upload?ignoreOperators=images,rectangle
```

#### ignoreOperators: ARRAY
Ignore operators on the filtering process once the pdf has been parsed.
```
....xyz/upload?ignoreOperators=images,rectangle
```

#### remapOperatorsKeys: ARRAY
Remap operators types names on the fly on the filtering process. In this way, the rectangle could be representend as a true element inside a table.

The dot is the separator between the old value and the new value of the type name.

```
....xyz/upload?ignoreOperators[]=text.normalText
```

#### ignoreFrontPages: BOOLEAN
Ignore the pages that has an image that covers all the page or almost all the page. 

```
....xyz/upload?ignoreFrontPages=false
```

