import *  as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'
import { CSS2DRenderer, CSS2DObject} from 'three/examples/jsm/renderers/CSS2DRenderer'

import starsTexture from '../images/stars.jpg'
import sunTexture from '../images/sun.jpg'
import mercuryTexture from '../images/mercury.jpg'
import venusTexture from '../images/venus.jpg'
import earthTexture from '../images/earth.jpg'
import marsTexture from '../images/mars.jpg'
import jupiterTexture from '../images/jupiter.jpg'
import saturnTexture from '../images/saturn.jpg'
import saturnRingTexture from '../images/saturn ring.png'
import uranusTexture from '../images/uranus.jpg'
import uranusRingTexture from '../images/uranus ring.png'
import neptuneTexture from '../images/neptune.jpg'
import plutoTexture from '../images/pluto.jpg'
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls'

import SunSound from '../audio/sun_sonification.mp3';
import Mercury from '../audio/mercuryAudio.mp3'
import Venus from '../audio/venusAudio.mp3'
import Earth from '../audio/EarthAudio.mp3'
import Mars from '../audio/marsAudio.mp3'
import Jupiter from '../audio/jupiterAudio.mp3'
import Saturn from '../audio/saturnAudio.mp3'
import Uranus from '../audio/uranusAudio.mp3'
import Neptune from '../audio/neptuneAudio.mp3'
import Pluto from '../audio/plutoAudio.mp3'

const SunSoundAudio = new Audio(SunSound)
const MercuryAudio = new Audio(Mercury)
const VenusAudio = new Audio(Venus)
const EarthAudio = new Audio(Earth)
const MarsAudio = new Audio(Mars)
const JupiterAudio = new Audio(Jupiter)
const SaturnAudio = new Audio(Saturn)
const UranusAudio = new Audio(Uranus)
const NeptuneAudio = new Audio(Neptune)
const PlutoAudio = new Audio(Pluto)

const soundArr = 
[SunSoundAudio, MercuryAudio, VenusAudio,EarthAudio, MarsAudio,
JupiterAudio, SaturnAudio, UranusAudio, NeptuneAudio, 
PlutoAudio
]
 

const renderer = new THREE.WebGLRenderer()


const div = document.querySelector('#container')

// document.body.appendChild(renderer.domElement)
div.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1, 
    1000
)

const controls = new FirstPersonControls(camera, renderer.domElement)
controls.movementSpeed = 8;
controls.lookSpeed = 0.08
 const orbit = new OrbitControls(camera, renderer.domElement)

camera.position.set(-90, 140, 200)
camera.lookAt(scene.position)

// orbit.panSpeed = 2
// orbit.rotateSpeed = 2
orbit.maxDistance = 300
orbit.enableDamping = true
orbit.autoRotate = true
orbit.autoRotateSpeed = 0.5
// const controls = new FirstPersonControls(camera, renderer.domElement)
// controls.movementSpeed = 8;
// controls.lookSpeed = 0.04
orbit.saveState()

orbit.minPolarAngle = Math.PI / 4
orbit.maxPolarAngle = Math.PI / 2

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'//use screen vd orbit
document.body.appendChild(labelRenderer.domElement)

const ambientLight = new THREE.AmbientLight(0x333333)
scene.add(ambientLight)

const CubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = CubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
])

const textureLoader = new THREE.TextureLoader()


const sunGeo = new  THREE.SphereGeometry(16, 30, 30)
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
})
const sun = new THREE.Mesh(sunGeo, sunMat)
scene.add(sun)


// const mercuryGeo = new  THREE.SphereGeometry(3.2, 30, 30)
// const mercuryMat = new THREE.MeshStandardMaterial({
//     map: textureLoader.load(mercuryTexture)
// })
// const mercury = new THREE.Mesh(mercuryGeo, mercuryMat)

// sun.add(mercury)
//add một phần tử thành con để có relative - absolute

// const mercuryObj = new THREE.Object3D()//object vô hình
// mercuryObj.add(mercury)
// scene.add(mercuryObj)
// mercury.position.x = 28
//------mecury


function createPlanete(size, texture, position, ring){
    const geo = new  THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    })
    const mesh = new THREE.Mesh (geo, mat)
    const obj = new THREE.Object3D()
    scene.add(mesh)
    obj.add(mesh)

    if(ring){
        const ringGeo = new  THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius
            , 32)
        const ringMat = new THREE.MeshStandardMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        })
        const ringMesh = new THREE.Mesh (ringGeo, ringMat)
        obj.add(ringMesh)
        ringMesh.position.x = position
        ringMesh.rotation.x = -0.5 * Math.PI
    }

    scene.add(obj)
    mesh.position.x = position
    return { mesh, obj}
}

const mercury = createPlanete(3.2, mercuryTexture, 28)
const saturn = createPlanete(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
})
const venus = createPlanete(5.8, venusTexture, 44)
const earth = createPlanete(6, earthTexture, 62)
const mars = createPlanete(4, marsTexture, 78)
const jupiter = createPlanete(12, jupiterTexture, 100)
const uranus = createPlanete(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
})
const neptune = createPlanete(7, neptuneTexture, 200)
const pluto = createPlanete(2.8, plutoTexture, 216)

const planetArr = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto ]


const pointLight = new THREE.PointLight(0xFFFFFF, 8000, 300)// color - intensity - maximun distance
scene.add(pointLight)
// -> vấn đề là các hành tinh bị phụ  thuộc vào trục tâm nên ko thay đổi dc tốc độ
// => giải pháp: mỗi hành tinh có quỹ đạo  riêng



// const p = document.createElement('p')
// p.className = 'tooltip'
// const pContainer = document.createElement('div')
// pContainer.appendChild(p)
// const cPoint = new CSS2DObject(pContainer)
// scene.add(cPoint)

const pContainer = document.createElement('div')




const pSun = document.createElement('p')
pSun.className = 'tooltip'
const SunLabel = new CSS2DObject(pSun)
SunLabel.position.set(0, 19, 0)


//mercury
const pMercury = document.createElement('p')
pMercury.className = 'tooltip'
const MercuryLabel = new CSS2DObject(pMercury)
MercuryLabel.position.set(28, 8, 0)

//venus
const pVenus = document.createElement('p')
pVenus.className = 'tooltip'
const VenusLabel = new CSS2DObject(pVenus)
VenusLabel.position.set(44, 10, 0)

//earth
const cEarth = document.createElement('p')
cEarth.className = 'tooltip'
const EarthLabel = new CSS2DObject(cEarth)
EarthLabel.position.set(62, 12, 0)

//mars
const pMars = document.createElement('p')
pMars.className = 'tooltip'
const MarsLabel = new CSS2DObject(pMars)
MarsLabel.position.set(78, 9, 0)

//jupiter
const pJupiter = document.createElement('p')
pJupiter.className = 'tooltip'
const JupiterLabel = new CSS2DObject(pJupiter)
JupiterLabel.position.set(100, 15, 0)

//saturn
const pSaturn = document.createElement('p')
pSaturn.className = 'tooltip'
const SaturnLabel = new CSS2DObject(pSaturn)
SaturnLabel.position.set(138, 15, 0)

//uranus
const pUranus = document.createElement('p')
pUranus.className = 'tooltip'
const UranusLabel = new CSS2DObject(pUranus)
UranusLabel.position.set(176, 11.5, 0)

//neptune
const pNeptune = document.createElement('p')
pNeptune.className = 'tooltip'
const NeptuneLabel = new CSS2DObject(pNeptune)
NeptuneLabel.position.set(200, 11.5, 0)

//pluto
const pPluto = document.createElement('p')
pPluto.className = 'tooltip'
const PlutoLabel = new CSS2DObject(pPluto)
PlutoLabel.position.set(216, 7, 0)


pContainer.appendChild(pSun)
pContainer.appendChild(pMercury)
pContainer.appendChild(pVenus)
pContainer.appendChild(cEarth)
pContainer.appendChild(pMars)
pContainer.appendChild(pJupiter)
pContainer.appendChild(pSaturn)
pContainer.appendChild(pUranus)
pContainer.appendChild(pNeptune)
pContainer.appendChild(pPluto)

const TextArr = [
pSun, pMercury, pVenus, 
cEarth, pMars, pJupiter, 
pSaturn, pUranus, pNeptune, pPluto]


const LabelArr = [
SunLabel, MercuryLabel, VenusLabel,
EarthLabel, MarsLabel, JupiterLabel,
SaturnLabel, UranusLabel, NeptuneLabel, PlutoLabel
]

let flag = true

let currentIndex = 0


const fullScreen = document.querySelector('.fullScreen')
const Exit = document.querySelector('.Exit')
const btnList = document.querySelectorAll('.BtnWrapper button')
const volumeRange = document.querySelectorAll('.BtnWrapper input')
const Menu = document.querySelector('.MenuBtn')
const ListBtn = document.querySelector('.ListBtn')
const Unlock = document.querySelector('.unlockBtn')
const volumeRangeWrapper = document.querySelectorAll('.volume')

console.log(Unlock)
fullScreen.addEventListener('click', () => {
    let de = document.documentElement;
    if (de.requestFullscreen) { de.requestFullscreen(); }
    else if (de.mozRequestFullScreen) { de.mozRequestFullScreen(); }
    else if (de.webkitRequestFullscreen) { de.webkitRequestFullscreen(); }
    else if (de.msRequestFullscreen) { de.msRequestFullscreen(); }
})

Exit.addEventListener('click', () => {
    if (document.exitFullscreen) { document.exitFullscreen(); }
    else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
    else if (document.msExitFullscreen) { document.msExitFullscreen(); }
})


Menu.addEventListener('click', () => {
    ListBtn.classList.toggle('display_none')
})
console.log(pointLight)
function clearProPlanet(){
    orbit.enabled = true
    flag = true
    if(planetArr[currentIndex].obj){
        planetArr[currentIndex].obj.remove(camera)
    }
    gsap.to(camera.position, {
        x: -90,
        y:  140,
        z:  200
  
    })
    //orbit.reset()
    console.log(currentIndex)
    
    soundArr[currentIndex].pause()
    
    volumeRangeWrapper[currentIndex].classList.remove('showBtnVolume')
   
    TextArr[currentIndex].className = 'tooltip hide'
}

for (let i = 0; i < btnList.length; i++) {
    
    btnList[i].addEventListener('click', () => {
        clearProPlanet()
        volumeRangeWrapper[i].classList.add('showBtnVolume')
        currentIndex = i
        Unlock.innerHTML = '<i class="bx bxs-lock-open-alt" ></i> Unlock'
        TextArr[i].className = "tooltip show"
    })

    addPlanetClick(btnList[i], planetArr[i], soundArr[i], LabelArr[i])
    
    volumeRange[i].addEventListener('change', function(e){
        console.log(e.target.value)
        soundArr[i].volume = e.target.value
    })

    
}




Unlock.addEventListener('click', () => {
    

    Unlock.innerHTML = "<i class='bx bxs-lock-alt' ></i> Lock"

    orbit.enabled = true
    flag = true
    if(planetArr[currentIndex].obj){
        planetArr[currentIndex].obj.remove(camera)
    }
    gsap.to(camera.position, {
        x: -90,
        y:  140,
        z:  200
  
    })
    //orbit.reset()
    console.log(currentIndex)
    
    soundArr[currentIndex].pause()
    
    volumeRangeWrapper[currentIndex].classList.remove('showBtnVolume')
   
    TextArr[currentIndex].className = 'tooltip hide'
    
})




console.log(sun.mesh)


//chuẩn trái đấy là 6 - > 10
//3.2

function addPlanetClick(element, planet, sound, Label){
   
    element.addEventListener('click', () => {
        orbit.reset()
        orbit.enabled = false
        flag = false

        

        sound.play()
        // sound.loop = true
    

        if(planet.obj){
            planet.obj.add(Label)
            planet.obj.add(camera)
        }

        if(planet.mesh){
            gsap.to(camera.position, {
                x: planet.mesh.position.x - 15,
                y: planet.mesh.position.y + 26,
                z: planet.mesh.position.z + 40
            })
    
        }else{
            gsap.to(camera.position, {
                x: planet.position.x - 17,
                y: planet.position.y + 30,
                z: planet.position.z + 40
            })
            sun.add(SunLabel)
        }

    })
}


pSun.innerText
= "Mặt Trời (Sun):\n Khối lượng: 99,8% hệ mặt trời\n Tốc độ xoay: 1.997km/s"
     
pMercury.innerText
= "Sao Thủy (Mercury):\n ĐK: 4.878km (0.147 DT bề mặt Trái Đất)\n Quỹ đạo: 88 ngày Trái Đất\n Vị trí: 1"

pVenus.innerText 
= "Sao Kim (Venus):\n ĐK: 12.104km\n Vị trí: 2\n Quỹ đạo: 5 ngày Trái Đất (quay ngược)"

cEarth.innerText
 = "Trái Đất (Earth):\n DT: 510tr km2. \n vị trí: 3\nQuỹ đạo: 365.24 ngày \n tốc độ: 29,789km/s "

pMars.innerText 
= "Sao Hỏa (Mars):\nDT: 144.8tr km2 \nĐK: 6.787km\n Vị trí: 4\nQuỹ đạo: 687 ngày Trái Đất "

pJupiter.innerText 
= "Sao mộc (Jupiter):\nDT: 121.9 lần Trái Đất \nQuỹ đạo: 11.9 năm Trái Đất"

pSaturn.innerText 
= "Sao thổ (Saturn):\nDT: 83.7 lần Trái Đất\n Vị trí: 6\nQuỹ đạo: 29.5 năm Trái Đất"

pUranus.innerText 
= "Sao Thiên vương (Uranus):\nDT: 15.91 lần Trái Đất\n Vị trí: 7\n Quỹ đạo: 84 năm Trái Đất"

pNeptune.innerText 
= "Sao hải vương (Neptune):\nDT: 15 lần Trái Đất\n Vị trí: 8\n Quỹ đạo: 165 năm Trái Đất"

pPluto.innerText 
= "Sao Diêm vương (Pluto):\nDT: 0.035 lần Trái Đất\ Vị trí: 9\n Quỹ đạo: 248 năm Trái Đất"

function animate(){
    //  controls.update(clock.getDelta())
    if(flag){
        orbit.update()
    }

    
   

    sun.rotateY(0.004)

    mercury.mesh.rotateY(0.004)
    mercury.obj.rotateY(0.04)

    venus.mesh.rotateY(0.002)
    venus.obj.rotateY(0.015)

    earth.mesh.rotateY(0.02)
    earth.obj.rotateY(0.01)
    

    mars.mesh.rotateY(0.018)
    mars.obj.rotateY(0.008)

    jupiter.mesh.rotateY(0.004)
    jupiter.obj.rotateY(0.002)

    saturn.mesh.rotateY(0.038)
    saturn.obj.rotateY(0.0009)

    uranus.mesh.rotateY(0.03)
    uranus.obj.rotateY(0.0004)

    neptune.mesh.rotateY(0.032)
    neptune.obj.rotateY(0.0001)

    pluto.mesh.rotateY(0.008)
    pluto.obj.rotateY(0.00007)
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera)






    
}

renderer.setAnimationLoop(animate)

window.addEventListener('resize', function(){
    labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

})


screen.orientation.addEventListener("change", function(e) {
    console.log(e.currentTarget)
    if(e.currentTarget.type === "landscape-primary"){
        if(window){
            labelRenderer.setSize(window.innerWidth, window.innerHeight)

            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
           
            console.log('bruh')
        }

    }
});