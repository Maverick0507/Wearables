import React from 'react'
import './Home.css'
import Layout from '../../layout/Layout'
import Hero from '../../components/hero/Hero'
import ProductCrousel from '../../components/ProductCrousel/ProductCrousel'
import './Home.css'
import Hero2 from '../../components/hero/Hero2'
import Banner from '../../components/banner/Banner'
import Sale from '../../components/sale/Sale'
const Home = () => {
  return (

    <Layout>
      <div className="home">
        <Hero />
        <ProductCrousel />
        <Hero2 />
        <Banner />
        <Sale />
      </div>
    </Layout>

  )
}

export default Home
