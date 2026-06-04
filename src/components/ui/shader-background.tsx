"use client"

import { Canvas } from "@react-three/fiber"
import { ShaderPlane } from "./background-paper-shaders"

export function ShaderBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ShaderPlane 
          position={[0, 0, 0]} 
          color1="#111111" 
          color2="#000000" 
        />
      </Canvas>
    </div>
  )
}
