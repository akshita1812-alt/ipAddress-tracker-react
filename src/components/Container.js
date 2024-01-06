import React,{useState,useEffect} from 'react'
import arrow from "./images/icon-arrow.svg"
import {MapContainer, TileLayer} from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import Markerposition from './mapPosition';
import background from './images/pattern-bg-desktop.png'

function Container() {
    const[ipaddress, setIpaddress] =  useState(null)   //setAddress
  const[map,setMap] = useState("")      //setIpAdrress

  const checkIpAddress = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi
  const checkDomain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/


  useEffect(() =>{
    try{
        const fetchIP = async () => {
            const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_85GmLmyV1D8YXWFbggczecdHtwjVw&ipAddress=8.8.8.8`)
            const data = await res.json()
            console.log(data)
            setIpaddress(data)
          }
      fetchIP()
    }
    catch(error){
      console.trace(error)
    }
  },[])

  const getIPaddress = async () =>{
    const res = await fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=at_85GmLmyV1D8YXWFbggczecdHtwjVw&${
      checkIpAddress.test(map)
        ? `ipAddress=${map}`
        : checkDomain.test(map)
        ? `domain=${map}`
        : ""
    }`)
    const data = await res.json()
    // console.log(data)
    setIpaddress(data)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    getIPaddress()
    setMap("")
  }

  return (
    <>
    <section>
        <div className='absolute w-full -z-10'>
        <img src={background} alt="" className="w-full h-80" />
        </div>
        <div className="max-w-xl mx-auto p-8">
          <h1 className="font-bold text-2xl lg:text-3xl text-white pb-8 text-center">
            IP Address Tracker
          </h1>
            <form onSubmit={handleSubmit} className="w-full flex" autoComplete='off'>
               <input type="text" placeholder='Search for any IP address or domain' 
                className="w-full py-2 px-4 rounded-l-lg"
                value={map}
                onChange={(e) => setMap(e.target.value)}
               />
         <button type="submit" className="bg-black py-2 px-4 rounded-r-lg">
              <img src={arrow} alt="" /> </button> 
            </form></div>
{ipaddress && (
 <>
<article className="p-8">
    <div className="bg-white rounded-xl p-8 shadow max-w-6xl mx-auto grid grid-cols-1 gap-5 text-center md:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:text-left -mb-10 relative lg:-mb-32" 
        style={{ zIndex: 10000,}} >
  <article className='lg:border-r lg:border-slate-400 p-6'>
  <h2 className="text-sm uppercase text-slate-600">IP Address</h2>
  <p className="font-bold text-slate-900 text-2xl">{ipaddress.ip}</p>
  </article>
  <article className='lg:border-r lg:border-slate-400 p-6'>
  <h2 className="text-sm uppercase text-slate-600">Location</h2>
  <p className="font-bold text-slate-900 text-2xl">{ipaddress.location.city},{ipaddress.location.region}</p>
  </article>
  <article className='lg:border-r lg:border-slate-400 p-6'>
  <h2 className="text-sm uppercase text-slate-600">Timezone</h2>
  <p className="font-bold text-slate-900 text-2xl"> UTC {ipaddress.location.timezone}</p>
  </article>
  <article className='lg:border-r lg:border-slate-400 p-6'>
  <h2 className="text-sm uppercase text-slate-600">ISP</h2>
  <p className="font-bold text-slate-900 text-2xl">{ipaddress.isp}</p>
  </article>
  </div>
 </article>
    <MapContainer center={[ipaddress.location.lat, ipaddress.location.lng]} zoom={13}  style={{ height: "100vh", width: "100vw" }}>
        <TileLayer  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
         <Markerposition ipaddress={ipaddress} />
        </MapContainer>
         </>
         )}
    </section>
    </>
  )
}

export default Container