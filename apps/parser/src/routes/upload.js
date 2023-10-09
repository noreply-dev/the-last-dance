const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { Router } = require('express')
const { _400, _500, _200 } = require('../lib/http')
const uploadController = require('../controllers/upload.controller')

const fileUploader = multer({
  dest: path.join(__dirname, '..', '.temp')
})

const router = Router()

router.post('/', fileUploader.single('filePdf'), async (req, res) => {
  const { query } = req
  console.log('query params', query)
  const file = req.file

  if (!file) {
    return _400(res, 'A file is required to post this endpoint')
  }

  // mimetype: 'application/pdf',
  if (file.mimetype.split('/')[1] !== 'pdf') {
    return _400(res, 'Filetype is not supported by the service')
  }

  const gptResponse = await uploadController.pdfReducer(file.path, query)

  if (!gptResponse) {
    return _500(res, 'Something went wrong parsing the file.')
  }

  return _200(res, undefined, gptResponse)
})

router.post('/page', fileUploader.single('filePdf'), async (req, res) => {
  const { query } = req
  console.log('query params', query)
  const file = req.file

  if (!file) {
    return _400(res, 'A file is required to post this endpoint')
  }

  // mimetype: 'application/pdf',
  if (file.mimetype.split('/')[1] !== 'pdf') {
    return _400(res, 'Filetype is not supported by the service')
  }

  if (query?.page) {
    setTimeout(() => {
      const page = cachedResponses[Number(query.page) - 1]
      return _200(res, undefined, page)
    }, 6000)
    fs.unlinkSync(file.path)

    return
  }

  const gptResponse = await uploadController.singlePagePdfReducer(file.path, query)

  if (!gptResponse) {
    return _500(res, 'Something went wrong parsing the file.')
  }

  return _200(res, undefined, gptResponse)
})

module.exports = router

const cachedResponses = [
  {
    products: [
      {
        name: 'FC-C110-1000',
        price: 'Tramo recto en DN110/160 de 1000mm',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'FC-C110-2000',
        price: 'Tramo recto en DN110/160 de 2000mm',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'FC-CE110-15',
        price: 'Codo de 15º en DN110/160',
        color: '7 738 113 102',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'FC-CE110-30',
        price: 'Codo de 30º en DN110/160',
        color: '7 738 113103',
        'reference code': '70',
        extra_data: [

        ]
      },
      {
        name: 'FC-CE110-45',
        price: 'Codo de 45º en DN110/160',
        color: '7 738 113 104',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'FC-CE110-87',
        price: 'Codo de 87º en DN110/160',
        color: '7 738 113 105',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'Adaptador para tejado plano DN166 con inclinación de 0-15º y 170mm',
        price: 'FC-O110',
        color: '7 738 113 127',
        'reference code': 'con inclinación de 0-15º y 170mm',
        extra_data: [

        ]
      },
      {
        name: 'Teja negra de paso DN166 y cubiertas con inclinación de entre 5-25º',
        price: '7 738 113 128',
        color: 'con inclinación de entre 5-25º',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'Teja negra de paso DN166 y cubiertas con inclinación de entre 25-45º',
        price: '7 738 113 129',
        color: 'con inclinación de entre 25-45º',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'Adaptador de montaje',
        price: 'paralelo',
        color: 'DN110/185 a DN110 / DN110',
        'reference code': '7 736 701 921',
        extra_data: [

        ]
      },
      {
        name: 'Nota: Sólo el kit FC-Set110-C33x incluye el deflector de salida de gases.',
        price: 'undefined',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'Catálogo general',
        price: 'undefined',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      }
    ]
  },
  {
    products: [
      {
        name: 'WJC215A0021001',
        price: '6,2',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0022001',
        price: '6,2',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0053001',
        price: '12',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0021036',
        price: '6,2',
        color: 'INCH 2.4x2.4x4.7',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0022036',
        price: '14,1,3,6',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0053036',
        price: 'INCH 2.8x1.4x1.3,INCH 5.5x1.4x1.3',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0052001',
        price: '6,2,8,7',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0004001',
        price: '6,8,14,5',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0005001',
        price: '12,14,6,8,1',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0052036',
        price: '8,7',
        color: 'INCH 2.4x3.4x5.7',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0004036',
        price: 'undefined',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      },
      {
        name: 'WJC215A0005036',
        price: 'undefined',
        color: 'undefined',
        'reference code': 'undefined',
        extra_data: [

        ]
      }
    ]
  },
  {
    products: [
      {
        name: 'VÁLVULA DE DESAGÜE CLICK-CLACK*',
        'reference code': [
          'WJC205G0018001',
          'WJC205G0018036'
        ],
        color: [
          'undefined'
        ],
        price: [
          '25,00 €',
          '66,00 €'
        ],
        extra_data: [
          '6,5',
          '6,2'
        ],
        additional_properties: [
          'Logic',
          'Architect'
        ]
      }
    ]
  },
  {
    products: [
      {
        name: 'NEE 250C-250-3 ECU',
        price: 'undefined',
        color: 'undefined',
        reference_code: 'undefined',
        extra_data: [
          'Tensión nominal de empleo: hasta 800V(AC)',
          'Tipo de red: AC',
          'Frecuencia de red: 50/60 Hz',
          'Corriente nominal: hasta 600A',
          'Tensión nominal de aislamiento [Ui]: 800V (AC)',
          'Tecnología de disparo: termomagnético ajustables térmica y magnéticamente',
          'Montaje en superficie'
        ]
      },
      {
        name: 'NEE 160C-160-4 TM',
        price: '45',
        color: 'undefined',
        reference_code: 'undefined',
        extra_data: [
          'Tensión nominal de empleo: hasta 800V(AC)',
          'Tipo de red: AC',
          'Frecuencia de red: 50/60 Hz',
          'Corriente nominal: hasta 600A',
          'Tensión nominal de aislamiento [Ui]: 800V (AC)',
          'Tecnología de disparo: termomagnético ajustables térmica y magnéticamente',
          'Montaje en superficie'
        ]
      }
    ]
  }

]
