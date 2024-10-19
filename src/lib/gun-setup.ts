/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GunOptions } from 'gun';
import Gun from 'gun/gun';
import SEA from 'gun/sea';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

const gunOptions: GunOptions = {
  peers: ['https://gun-manhattan.herokuapp.com/gun'],
};

export const db = Gun(gunOptions);
export const user = db.user().recall({ sessionStorage: true });

export const username = writable('');
export const usersea : Writable<{ [key: string]: any }>= writable({});
export const scmroom = writable({});
export const trustorToView = writable({});

db.on( 'auth', async () => {
    const alias = await user.get( 'alias' );

    username.set( alias || '' );
    usersea.set( user._.sea );
   
    console.log( 'signed in as', alias || undefined );
    console.log( 'usersea', user._.sea );

    await user.get( 'securimed' ).get( 'scmroom' ).get( 'hr' ).then( async ( data: any ) => {
      if ( !data ) {
        const keypair = await SEA.pair();
        const enc_pair = await SEA.encrypt( keypair, user._.sea );
        user.get( 'securimed' ).get( 'scmroom' ).get('hr').put( enc_pair );
        scmroom.set( keypair );
        console.log( 'scmroom created', keypair );
      } else {
        console.log( 'pair', data );
        const dec = await SEA.decrypt( data, user._.sea );
        scmroom.set( dec );
        console.log( 'scmroom retrieved', dec );
      }
    });
} );

export const getUserData = () => {
  let userdata: { [key: string]: any } = {};
  usersea.subscribe( ( data: any ) => {
    userdata['sea'] = data;
  });
  username.subscribe( ( data: any ) => {
    userdata['alias'] = data;
  });
  return userdata;
}

export const getSCMRooms = () => {
  let val = '';
  scmroom.subscribe( ( data: any ) => {
    val = data;
  });

  return val;
}

export const getUserEPub = ( pub: string ) => {
  let epub = '';
  db.user( pub ).get( 'epub' ).once( ( data: any ) => {
    epub = data;
  } );
  return epub;
}
