import React, { useState } from 'react';
import auth0 from '../lib/auth0';
import axios from 'axios';

const CreateStatus = () => {
  const [dados, setDados] = useState({
    status: 'bem',
    coords: {
      lat: null,
      long: null,
    }
  })
  const getMyLocation = () => {
    //se o navegador tiver a funcionalidade de geolocalização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        //define uma função que pega a versão antiga dos dados e retorna uma versão nova
        setDados(old => {
          return {
            //pega tudo que já tava na variável dados
            ...old,
            coords: {
              lat: position.coords.latitude,
              long: position.coords.longitude,
            }
          };
        });
      });
    }
  };

  const onStatusChange = evt => {
    const value = evt.target.value;
    setDados(old => {
      return {
        //pega tudo que já tava na variável dados
        ...old,
        status: value
      };
    });
  };

  const save = async () => {
    await axios.post('/api/save-status', dados);
    /*
    useEffect(() => {
      if (!props.isAuth) {
        router.push('/');
      } else if (props.forceCreate) {
        router.push('/create-status');
      }
    });
    */
  };


  return (
    <div className='p-5 rounded text-left max-w-lg mx-auto my-16 object-contain'>
      <h1 className='text-center font-bold text-lg'>Create Status</h1>

      <div className='ml-16 my-4'>

        <label className='block'>
          <input type='radio' name='status' value='Bem' onClick={onStatusChange} />Estou bem e sem sintomas.
      </label>

        <label className='block'>
          <input type='radio' name='status' value='Gripe' onClick={onStatusChange} />Estou com sintomas de gripe / resfriado.
      </label>

        <label className='block'>
          <input type='radio' name='status' value='Covid' onClick={onStatusChange} />Estou com sintomas de COVID.
      </label>
        <p className='my-8'>
          Sua posição atual: <br/>
          Latitude: {JSON.stringify(dados.coords.lat)} <br/> 
          Longitude: {JSON.stringify(dados.coords.long)} 
        </p>
      </div>
      <button className='my-2 p-3 rounded bg-pink-800 font-bold shadow-xl hover:shadow block w-3/4 text-center mx-auto text-white' onClick={getMyLocation}>Pegar minha localização</button>
      <button className='my-2 p-3 rounded bg-pink-800 font-bold shadow-xl hover:shadow block w-3/4 text-center mx-auto text-white'
      onClick={save}>Salvar meu status</button>
    </div>
  );
};
export default CreateStatus;

//verificar se o usuario ta logado
export async function getServerSideProps({ req, res }) {
  const session = await auth0.getSession(req);
  if (session) {
    return {
      props: {
        isAuth: true,
        user: session.user,
      }
    }
  }
  return {
    props: {
      isAuth: false,
      user: {}
    }
  }
}