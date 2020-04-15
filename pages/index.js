import React from 'react';

const Index = () => {
  return (
    <div className='p-5 rounded text-left max-w-lg mx-auto my-16 object-contain'>
      <h1 className='text-center my-6 font-bold'> Bem-vindo ao MyDailyStatus!</h1>
      <p className='my-8 ml-4'>
        Diga como você está se sentindo, e descubra como estão as pessoas perto de você.<br/>
        O Objetivo do MyDailyStatus é você acompanhar de perto o avanço dos casos de COVID-19
        na sua região.
      </p>

      <a href='/api/login'
        className='my-2 p-3 rounded bg-pink-800 font-bold shadow-xl hover:shadow block w-3/4 text-center mx-auto text-white'>
        Comece por aqui
      </a>
    </div>
    )};

export default Index;