// 'use client'

// import dynamic from 'next/dynamic'
// // import parse from 'html-react-parser';
// import axios from 'axios';
// import { useState } from "react";

// function onSubmit(name, area, logo) {
//     console.log(name, area, logo)
//         let data={
//             name : name,
//             area : area,
//             logo : logo,
//         }
//         axios
//             .post('/api/createCity', data)
//             .then((response) => {console.log(response)})
//             .catch((e) => { console.log(e)}
// )}

// export default function CreateCity() {

//     const [name, setName] = useState('');
//     const [area, setArea] = useState('');
//     const [logo, setLogo] = useState('');

//     const handleNameChange = (e) => {
//         setName(e.target.value);
//     };

//     const handleAreaChange = (e) => {
//         setArea(e.target.value);
//     };

//     const handleLogoChange = (e) => {
//         setLogo(e.target.value);
//     };

//     const onSubmit = () => {
//         let data = {
//             name: name,
//             area: area,
//             logo: logo,
//         };

//         axios
//             .post('/api/createCity', data)
//             .then((response) => {
//                 console.log(response);
//             })
//             .catch((e) => {
//                 console.log(e);
//             });
//     };
    
//     return (
//         <>
//             <input type="text" value={name} onChange={handleNameChange} />
//             <input type="text" value={area} onChange={handleAreaChange} />
//             <input type="text" value={logo} onChange={handleLogoChange} />
//             <button onClick={onSubmit}>Send post</button>
//         </>
//     )
// }