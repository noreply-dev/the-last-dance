import React, { createContext, useEffect, useRef, useState } from 'react'
import { atom } from 'jotai'

// jotai version

export const ProductsAtom = atom([[{}]])
export const ProductsSchemasAtom = atom([''])
export const FocusProductAtom = atom(0)
export const FocusFieldAtom = atom(0)

export function resetPage(
  setPagesData: Function,
  pagesData: any,
  pageIndex: number,
  productIndex: number,
  setFocusField: Function
) {
  const newData = [...pagesData]

  Object.keys(newData[pageIndex][productIndex]).map((key: string) => {
    newData[pageIndex][productIndex][key] = '' // unset values for keys
  })

  setPagesData(newData)
  setFocusField(0)
}

export function removeField(
  setPagesData: Function,
  pagesData: any,
  pageIndex: number,
  productIndex: number,
  field: string
) {
  const newData = [...pagesData]
  delete newData[pageIndex][productIndex][field]

  setPagesData(newData)
}

export function addField(
  setPagesData: Function,
  pagesData: any,
  pageIndex: number,
  productIndex: number,
  name: string
) {
  const newData = [...pagesData]

  if (name !== '') {
    newData[pageIndex][productIndex][name] = ''
  }

  setPagesData(newData)
}