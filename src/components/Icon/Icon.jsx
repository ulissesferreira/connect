import React from 'react'
import styles from './icon.module.scss'
import { classes } from 'utils/css'

export default function Icon({ icon = 'info', onClick }) {
  return (
    <svg
      className={classes(styles.icon, { [styles.clickable]: onClick })}
      xmlns="http://www.w3.org/2000/svg"
      width={svg[icon].size || '24'}
      height={svg[icon].size || '24'}
      viewBox={`0 0 ${svg[icon].size || '24'} ${svg[icon].size || '24'}`}
      {...{ onClick }}
    >
      {'path' in svg[icon] && <path d={svg[icon].path} {...svg[icon].props} />}
      {'markup' in svg[icon] && svg[icon].markup}
    </svg>
  )
}

const svg = {
  info: {
    path:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  },
  arrow_back: {
    path: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  },
  arrow_down: {
    path: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  },
  arrow_up: {
    path: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  },
  close: {
    path:
      'M22.6464 10.7636C22.8417 10.5683 22.8417 10.2517 22.6464 10.0564L21.9436 9.35355C21.7483 9.15829 21.4317 9.15829 21.2364 9.35355L16.3536 14.2364C16.1583 14.4317 15.8417 14.4317 15.6464 14.2364L10.7636 9.35355C10.5683 9.15829 10.2517 9.15829 10.0564 9.35355L9.35355 10.0564C9.15829 10.2517 9.15829 10.5683 9.35355 10.7636L14.2364 15.6464C14.4317 15.8417 14.4317 16.1583 14.2364 16.3536L9.35355 21.2364C9.15829 21.4317 9.15829 21.7483 9.35355 21.9436L10.0564 22.6464C10.2517 22.8417 10.5683 22.8417 10.7636 22.6464L15.6464 17.7636C15.8417 17.5683 16.1583 17.5683 16.3536 17.7636L21.2364 22.6464C21.4317 22.8417 21.7483 22.8417 21.9436 22.6464L22.6464 21.9436C22.8417 21.7483 22.8417 21.4317 22.6464 21.2364L17.7636 16.3536C17.5683 16.1583 17.5683 15.8417 17.7636 15.6464L22.6464 10.7636Z',
    size: 32,
  },
  add: {
    path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  },
  location: {
    path:
      'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  },
  search: {
    path:
      'M12.4389 7.21943C12.4389 10.102 10.102 12.4389 7.21943 12.4389C4.33682 12.4389 2 10.102 2 7.21943C2 4.33682 4.33682 2 7.21943 2C10.102 2 12.4389 4.33682 12.4389 7.21943ZM10.1091 13.8373C9.22428 14.2242 8.24692 14.4389 7.21943 14.4389C3.23225 14.4389 0 11.2066 0 7.21943C0 3.23225 3.23225 0 7.21943 0C11.2066 0 14.4389 3.23225 14.4389 7.21943C14.4389 9.03274 13.7703 10.6899 12.6663 11.9579C12.8574 12.0454 13.0364 12.1678 13.1937 12.3251L16.7696 15.901C17.4786 16.61 17.4786 17.7594 16.7696 18.4683C16.0607 19.1772 14.9113 19.1772 14.2024 18.4683L10.6264 14.8924C10.3302 14.5962 10.1578 14.2231 10.1091 13.8373Z',
    props: {
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    },
    size: 19,
  },
  google: {
    markup: (
      <g>
        <path
          d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"
          fill="#4285F4"
        />
        <path
          d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"
          fill="#34A853"
        />
        <path
          d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"
          fill="#FBBC05"
        />
        <path
          d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"
          fill="#EA4335"
        />
      </g>
    ),
    size: 20,
  },
}
