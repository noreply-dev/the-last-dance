exports.initialize = (firstPage) => `I have parsed a products catalog pdf and now I have all the pdf content operators.
We need to parse these operators into a json object which will have product keys 
like price, size, or any other information about the product.

The format is:
<elementType>    <x-coordinate>    <y-coordinates>    <extra-data>

And normally there are lots of lines, one for each pdf operator. Not all the operators are important, but the most important thing is that not every operator is relevant to be a whole produt and maybe it's only an attribute for another. So based in that you need to make assumptions of which lines could represent the same product and merge on a unique product .

First pdf page:  

${firstPage}

Generate a json array, where each element in the array is a product found in the pdf, including its available data, like color, size, or any other interesting product feature found in the pdf.

I want a float value between 0 and 1 per product that represents the certainty you have on your answer based on the product structure and the certainty of the data. This is so important and it's imperative to have a percentage field with a percentage of security you have on the answer.  

The format of each product must have a name, color, reference, price, percentage. If some info is missing fill the field with "undefined" and the extra data insert into extra_data field.

If there are more than one value for a field, merge all the value inside an array of the field. Never duplicate field in the output. If there are more than one value per field merge on an array. 

When the information associated with the product has multiple choices (like multiple possible colors or sizes) use an array with each possible option.

The output json should be inside a key called "products" which the value will be the products array of that page.

answer only with the json example format, and do not include any reasoning except for the json itself. Make the assumptions you need and infer anything you need. Do not include anything else than the json response. Your response should be only the JSON. The JSON should include all the products you found in the pdf. Do not omit any product from the pdf and your answer should be limited to json. Aswer only with the final json and nothing else. 

Do not include sentences for humans, like "Here's the json array" or anything like that. Just the json, nothing else.`

exports.generatePage = (pageNumber, data) => `This is the page ${pageNumber}. Remember the previous context if you need more information about the previous products to output of this new products json. 

Remeber also that if you don't have at least the name and the price of the product maybe is better to skip that product. 

Page ${pageNumber} of the pdf

${data}

Generate a json array, where each element in the array is a product found in the pdf, including its available data, like color, size, or any other interesting product feature found in the pdf.

When the information associated with the product has multiple choices (like multiple possible colors or sizes) use an array with each possible option.

I want a float value between 0 and 1 per product that represents the certainty you have on your answer based on the product structure and the certainty of the data. This is so important and it's imperative to have a percentage field with a percentage of security you have on the answer.  

The output json should be inside a key called "products" which the value will be the products array of that page.

answer only with the json example format, and do not include any reasoning except for the json itself. Make the assumptions you need and infer anything you need. Do not include anything else than the json response. Your response should be only the JSON. The JSON should include all the products you found in the pdf. Do not omit any product from the pdf and your answer should be limited to json. Aswer only with the final json and nothing else. 

Do not include sentences for humans, like "Here's the json array" or anything like that. Just the json, nothing else.`

exports.singplePagePdf = (data, madLibs) => `I'm parsing a pdf catalog content to get it's products, and I want you to get all this content and convert into a products JSON. 

But you have to keep in mind some constraints:

- The pdf is about ${madLibs.pdfTopic} and the language is ${madLibs.pdfLanguage}.
- Not all products have the same information, but all the products minimum properties are: ${madLibs.pdfProductsMinimunInfo.join(', ')}.
- When a product has more than one value per property, the value are inserted into an array of values like so: ['value1', 'value2', 'value3']
- All the extra data only related to a specific product store on the extra_data field. 
- If a pdf have undefined values for a property, you should set it as a string represented as "undefined".
- The ouput JSON should have only one property called products, and it should be an array of products.
- Your response should be only a JSON format output. Do not include any other information in your response. Just the JSON, nothing else.
- Do not include sentences for humans, like "Here is your response" or anything like that. Just the JSON, nothing else.

The pdf content format is:
<Text content>
<Another text content>
...

And normally there are lots of lines, one for each pdf operator. Not all the operators are important, but the most important thing is that not every operator is relevant to be a whole produt and maybe it's only an attribute for another. So based in that you need to make assumptions of which lines could represent the same product and merge on a unique product. 

Finally, inside the content lines are groups of lines separated by 2 break lines. This is to help you, we made a data clustering algorithm to have the near text grouped. The groups are separated by 2 break lines so keep this in mind while creating the JSON. 

The pdf content is:

${data}

Again chat, DO NOT INCLUDE ANY EXTRA DATA APART OF THE JSON. You should only include a json nothing else. I don't want human readable text.
`


// nasi goreng
exports.iWantProducts = (firstProductJSON, pdfData) => `
Estoy analizando unos pdfs de catálogos de productos. Te voy a pasar la información extraída en raw del pdf. Quiero que me devuelvas un JSON de todos los productos. 

Para generar los JSON te daré de ejemplo el del primer producto y tú tendrás que replicar su estructura para el resto.

La información al extraerla del pdf no está precisamente ordenada para que sea fácilmente inteligible. Tu misión es pasarla a un a los JSON para que si lo sea. 

Si hay información global que no pertenezca directamente a un producto usala como contexto pero no intentes añadirla a ningun json si no es necesario. Generalmente los textos descriptivos de una familia o variante aportan información muy útil por lo que intenta añadirlos a un producto siempre que puedas. Suelen encontrarse en las cabeceras debajo de los titulos y los reconoceras porque estan hecho con oraciones en lenguaje natural.

Generalmente todos los productos tienen una referencia y suele ser el valor más importante. Necesitamos obtener un listado de JSONs que represente a cada producto y sus atributos. En el JSON cada referencia será un producto con todos los atributos que sean necesarios para entender de que se tratata si solo pudiesemos ver uno de los articulos y no todo el listado. Consideraremos variante de un producto como un producto en si mismo. Tiene que haber una entrada en el JSON por cada referencia que encuentres aunque repitas información y el listado quede más largo. No intentes agrupar por familias o variedad de producto con características similares. 

Lo importante es que obtengamos un listado de JSONs que represente a cada producto y sus atributos.  

JSON de ejemplo del primer producto:

${firstProductJSON}

Primera página del PDF:

${pdfData}

Nadie va a revisar de entrada el resultado que me des por lo que es muy importante que no te dejes ningun articulo ni dupliques entradas. Se que para darme un mejor servicio y ser más amable vas a intentar darme información de contexto y aclaraciones. Es muy importante para mi que solo me devuelvas los JSON con la clave products y con un array de productos. 

Unicamente muestrame el json y nada más. No quiero que escribas ninguna explicacion, unicamente devuelveme el json y nada más. 

No quiero que me devuelvas nada que no sea un json. Finge que eres una maquina de json y que solo puede hablar json. Gracias ;)
`


