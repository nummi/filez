import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import useSwr from 'swr'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useS3Upload, getImageData } from 'next-s3-upload'

import { fileSizeString } from '../utils'

export default function Home() {
  const [imageUrl, setImageUrl] = useState()
  const [height, setHeight] = useState()
  const [width, setWidth] = useState()
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()

  const fetcher = (url) => fetch(url).then((res) => res.json())
  //const { files, filesError } = useSwr('/api/files', fetcher)
  const files = []
  const filesError = false
  const [filez, setFilez] = useState([])

  React.useEffect(() => {
    const go = async function () {
      const response = await fetch('/api/files')
      if (response.ok) {
        const json = await response.json()
        setFilez(json.files)
      }
    }

    go()
  }, [])

  const handleFileChange = async (file) => {
    const { url } = await uploadToS3(file)
    const { height, width } = await getImageData(file)
    setWidth(width)
    setHeight(height)
    setImageUrl(url)
  }

  return (
    <div className="container">
      <Head>
        <title>Filez</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <FileInput onChange={handleFileChange} />

        <button onClick={openFileDialog}>Upload file</button>

        {imageUrl && (
          <div>
            <Image src={imageUrl} width={width} height={height} />
            <div>{imageUrl}</div>
            <div>
              {height}x{width}
            </div>
          </div>
        )}

        {filesError && <div>Failed to load files</div>}
        {!files && <div>Loading files...</div>}
        {filez && !filesError && (
          <div>
            <h1>Files</h1>
            <ul className="list-none p-0">
              {filez.map(function (fileObj) {
                return (
                  <li key={fileObj.lastModified} className="mb-8">
                    <div className="text-xl">{<a href={fileObj.url}>{fileObj.name.split('/').pop()}</a>}</div>
                    <div className="font-mono text-sm">Size: {fileSizeString(fileObj.size)}</div>
                    <div className="font-mono text-sm">Uploaded: {fileObj.lastModified}</div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
