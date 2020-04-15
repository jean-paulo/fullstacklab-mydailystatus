import React, { useEffect } from 'react';
import auth0 from '../lib/auth0';
import router from 'next/router';
import { db } from '../lib/db';
import { distance } from '../lib/geo';

const App = (props) => {
  //executa somente uma vez
  //se o usuario não estiver logado ele é redirecionado para a home
  useEffect(() => {
    if (!props.isAuth) {
      router.push('/');
    } else if (props.forceCreate) {
      router.push('/create-status');
    }
  });

  if (!props.isAuth || props.forceCreate) {
    return null;
  }

  return (
    <div className='bg-pink-800 p-2 rounded text-left max-w-lg mx-auto my-12 object-contain'>
        <h1 className='font-bold text-white'>Bem-vindo, {props.user.name}</h1>
        {props.checkins.map(checkin => {
          return (
            <div className='text-white p-5 text-left max-w-lg mx-auto my-4 object-contain border-b'>
              <p className='text-white font-bold text-lg'>{checkin.id === props.user.sub && 'Seu status:'}</p><br/>
              <p className='text-white font-bold'>{checkin.status}<br/></p>
              <p className='leading-snug'>
              Latitude:{JSON.stringify(checkin.coords.lat)}<br/>
              Longitude:{JSON.stringify(checkin.coords.long)}
              </p>
              Distancia:{checkin.distance}
            </div>
          )
        })}
    </div>
  );
};



export default App;

//essa função só é possível com o next, não é possível apenas com create react-app
export async function getServerSideProps({ req, res }) {
  const session = await auth0.getSession(req);
  console.log(session);
  if (session) {
    const today = new Date();
    const currentDate = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
    const todaysCheckin = await db
      .collection('markers')
      .doc(currentDate)
      .collection('checks')
      .doc(session.user.sub)
      .get()

    const todaysData = todaysCheckin.data();
    let forceCreate = true;

    //se verdadeiro pode ver os checkins, se não, tem que postar
    if (todaysData) {
      //pode ver os outros checkins
      forceCreate = false;
      const checkins = await db.
        collection('markers')
        .doc(currentDate)
        .collection('checks')
        .near({
          center: todaysData.coordinates,
          radius: 1000
        })
        .get();

      const checkinsList = [];

      checkins.docs.forEach(doc => {
        checkinsList.push({
          id: doc.id,
          status: doc.data().status,
          coords: {
            lat: doc.data().coordinates.latitude,
            long: doc.data().coordinates.longitude
          },
          distance: distance(
            todaysData.coordinates.latitude,
            todaysData.coordinates.longitude,
            doc.data().coordinates.latitude,
            doc.data().coordinates.longitude
          ).toFixed(2)
        });
      });

      return {
        props: {
          isAuth: true,
          user: session.user,
          forceCreate: false,
          checkins: checkinsList,
        }
      };
    }

    return {
      props: {
        isAuth: true,
        user: session.user,
        forceCreate
      }
    };
  }
  return {
    props: {
      isAuth: false,
      user: {}
    }
  };
}
