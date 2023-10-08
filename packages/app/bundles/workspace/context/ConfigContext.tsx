import React, { createContext, useState } from 'react'

const defaultConfig = {
  "ignoreOperators": [],
  "remapOperatorsKeys": [],
  "ignoreFrontPages": false,
  "clusteringDistance": 7,
  "clusteringMinimun": 3,
  "pdfLanguage": "spanish",
  "pdfTopic": "is undefined",
  "pdfProductsMinimunInfo": ["name", "price", "reference code"],
  "page": 1,
  "model": 3
}

export const ConfigContext = createContext<any>(JSON.stringify(defaultConfig, null, 2))

export const ConfigProvider = ({ children }: { children: any }) => {
  const [config, setConfig] = useState(JSON.stringify(defaultConfig, null, 2))

  return <ConfigContext.Provider value={{ config, setConfig }}>
    {children}
  </ConfigContext.Provider>
}

