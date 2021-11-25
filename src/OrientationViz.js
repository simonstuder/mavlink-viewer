import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, GizmoHelper,GizmoViewcube } from '@react-three/drei'
import * as THREE from 'three'
import { useSelector } from 'react-redux'
import { Dropdown } from 'react-bootstrap'

function PlaneShape(props) {
    // scene of three fiber
    // x left right
    // y up down
    // z forward aft

    // aeronautical from mavlink
    // x forward
    // y right
    // z down

    const x_points = []
    x_points.push( new THREE.Vector3( 0, 0, 0))
    x_points.push( new THREE.Vector3( 1, 0, 0))
    const xgeom = new THREE.BufferGeometry().setFromPoints( x_points )
    const y_points = []
    y_points.push( new THREE.Vector3( 0, 0, 0))
    y_points.push( new THREE.Vector3( 0, 1, 0))
    const ygeom = new THREE.BufferGeometry().setFromPoints( y_points )
    const z_points = []
    z_points.push( new THREE.Vector3( 0, 0, 0))
    z_points.push( new THREE.Vector3( 0, 0, 1))
    const zgeom = new THREE.BufferGeometry().setFromPoints( z_points )

    const xy_points = []
    xy_points.push( new THREE.Vector3( -0.7, 0,  -0.7 ) )
    xy_points.push( new THREE.Vector3( 0.7, 0,   -0.7 ) )
    xy_points.push( new THREE.Vector3(  0,    0,   1 ) )
    xy_points.push( new THREE.Vector3( -0.7, 0,  -0.7 ) )
    xy_points.push( new THREE.Vector3( -0.7, 0,   0 ) )
    const xygeom = new THREE.BufferGeometry().setFromPoints( xy_points )

    const vert_points = []
    vert_points.push( new THREE.Vector3( 0, 0,    -0.1 ) )
    vert_points.push( new THREE.Vector3( 0, 0.4, -0.5 ) )
    vert_points.push( new THREE.Vector3( 0, 0.4, -0.7 ) )
    vert_points.push( new THREE.Vector3( 0, 0,     -0.7 ) )
    vert_points.push( new THREE.Vector3( 0, 0,      1 ) )
    const vertgeom = new THREE.BufferGeometry().setFromPoints( vert_points )

    const {w,x,y,z} = props.orientation
    const orient = new THREE.Quaternion(-z,y,-w,x)
    // w x -z -y      front back mirrored
    // -z y -w x      correct

    return (
        <>
            <group  position={new THREE.Vector3()} quaternion={orient}>
                <line geometry={xygeom}>
                    <lineBasicMaterial color="orange" />
                </line>
                <line geometry={vertgeom}>
                    <lineBasicMaterial color="yellow" />
                </line>

                <line geometry={xgeom} scale={0.5}>
                    <lineBasicMaterial color="red" />
                </line>
                <line geometry={ygeom} scale={0.5}>
                    <lineBasicMaterial color="blue" />
                </line>
                <line geometry={zgeom} scale={0.5}>
                    <lineBasicMaterial color="green" />
                </line>
            </group>
            <line geometry={xgeom}>
                <lineBasicMaterial color="red" />
            </line>
            <line geometry={ygeom}>
                <lineBasicMaterial color="blue" />
            </line>
            <line geometry={zgeom}>
                <lineBasicMaterial color="green" />
            </line>
        </>
    )
}


function OrientationViz (props) {

    const [sel_system, setSelSystem] = useState(undefined)
    const [sel_comp, setSelComp] = useState(undefined)

    const ASystems = useSelector((state) => state.mavlink_systems)

    const SState  = useSelector((state) => {
        if (sel_system===undefined) {
            return {}
        }
        if (!(sel_system in state.mavlink_systems)) {
            return {}
        }
        if (sel_comp===undefined) {
            return state.mavlink_systems[sel_system]
        }
        if (!(sel_comp in state.mavlink_systems[sel_system])) {
            return state.mavlink_systems[sel_system]
        }
        return state.mavlink_systems[sel_system][sel_comp]
    })

    const orientation = {w:1, x:0, y:0, z:0}

    if ("ATTITUDE_QUATERNION ( #31 )" in SState) {
        orientation.w = SState["ATTITUDE_QUATERNION ( #31 )"].q1
        orientation.x = SState["ATTITUDE_QUATERNION ( #31 )"].q2
        orientation.y = SState["ATTITUDE_QUATERNION ( #31 )"].q3
        orientation.z = SState["ATTITUDE_QUATERNION ( #31 )"].q4
    }
    



    return (
        <div style={{backgroundColor: "#000000", display: "inline-block"}}>
            <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [2.8, 1.3, 1] }}
                frameloop="demand"
                style={{
                        width: props.width || 600, 
                        height: props.height || 600
                    }} >
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <PlaneShape  orientation={orientation} />
                <GizmoHelper
                    alignment="bottom-right" // widget alignment within scene
                    margin={[80, 80]} // widget margins (X, Y)
                    >
                    <GizmoViewcube axisColors={['red', 'green', 'blue']} labelColor="black" />
                </GizmoHelper>
            </Canvas>
            <Dropdown
                onSelect={(evk, ev) => {
                    setSelSystem(Number(ev.target.innerText))
                }}>
                <Dropdown.Toggle>
                    Selected System: {sel_system===undefined?"none":sel_system}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {(typeof ASystems)=="object"?
                        Object.keys(ASystems).map((e) => (
                            <Dropdown.Item key={e}>{e}</Dropdown.Item>
                        ))
                    :
                    <></>
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default OrientationViz
