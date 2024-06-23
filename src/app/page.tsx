'use client';
import { ChangeEvent, useEffect, useState } from "react";

interface product {
  id: number;
  name: string;
  value: string;
  available: string;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState([] as product[])
  const [index, setIndex] = useState(1)
  const [product, setProduct] = useState({
    id: 1,
    name: '',
    value: '',
    available: '',
    description: ''
  } as product)

  const fieldValidation = (product: product) => {
    if (product.name === '' || product.value === '' || product.available === '' || product.description === '') {
      alert('Preencha todos os campos')
      return false
    }
    return true
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct({
      ...product,
      [name]: value
    })
  }

  const removeProduct = (index: number) => {
    const productsFiltered = products.filter((product) => product.id !== index)
    localStorage.setItem('products', JSON.stringify(productsFiltered))
    setProducts(productsFiltered)
  }

  const createProduct = () => {
    if (!fieldValidation(product)) return
    product.id = index
    const productsSorted = [...products, product].sort((a, b) => {
      if (parseFloat(a.value) < parseFloat(b.value)) return -1
      if (parseFloat(a.value) > parseFloat(b.value)) return 1
      return 0
    })
    localStorage.setItem('products', JSON.stringify(productsSorted))
    setProducts(productsSorted)
    setIndex(index + 1)
    setProduct({
      ...product,
      name: '',
      value: '',
      description: ''
    })
  }

  useEffect(() => {
    const productsStorage = localStorage.getItem('products')
    if (productsStorage) {
      setProducts(JSON.parse(productsStorage))
      const productSorted = JSON.parse(productsStorage).sort((a: product, b: product) => {
        if (a.id < b.id) return -1
        if (a.id > b.id) return 1
        return 0
      })
      setIndex(productSorted[productSorted.length - 1].id + 1)
    }
  }, [])

  return (
    <main className="flex flex-col items-center" >
      <form className="grid grid-cols-2 gap-3 bg-[#FF7035] my-3 p-3 rounded w-11/12">
        <div className="flex flex-col">
          <label>Nome do produto</label>
          <input className="text-black px-2 py-1 rounded" type="text" name="name" value={product.name} onChange={(e) => { handleChange(e) }} />
        </div>

        <div className="flex flex-col">
          <label>Valor do Produto</label>
          <input className="text-black px-2 py-1 rounded" name="value" type="number" value={product.value} onChange={(e) => { handleChange(e) }} />
        </div>
        <div className="flex flex-col justify-center">
          <p >Disponível para venda?</p>
          <div className="flex gap-3">
            <div>
              <input type="radio" name="available" value='Sim' onChange={(e) => { handleChange(e) }} />
              <label>Sim</label>
            </div>
            <div>
              <input type="radio" name="available" value='Não' onChange={(e) => { handleChange(e) }} />
              <label>Não</label>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Descrição do produto</label>
          <textarea className="text-black h-20 px-2 py-1 rounded" name="description" value={product.description} onChange={(e) => { handleChange(e) }} />
        </div>
        <button className="col-span-2 bg-black p-2 rounded" type="button" onClick={createProduct}>Submit</button>
      </form>


      <div className="bg-[#252525] w-11/12 pb-3 px-3 rounded">
        <h1 className="text-center m-3 text-[#FF7035]">Produtos</h1>
        <table className="w-full text-start border overflow-auto">
          <thead className="border-b" >
            <tr>
              <th className="text-start w-1/2 pl-4">Nome</th>
              <th className="text-start w-1/2 pl-4">Valor</th>
            </tr>
          </thead>
          <tbody className="">
            {products.map((product, index) => {
              return (
                <tr key={index} className="">
                  <td className="text-start w-1/2 pl-4">{product.name}</td>
                  <td className="text-start w-1/2 pl-4">{
                    <div className="flex justify-between items-center">
                      <p>{`R$ ${product.value}`}</p>
                      <p className="text-red-600 text-lg mr-4 cursor-pointer" onClick={() => removeProduct(product.id)}>x</p>
                    </div>
                  }</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
