import { useState } from 'react'
import { useS3Upload, getImageData } from 'next-s3-upload'
import Image from 'next/image'

import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  let [imageUrl, setImageUrl] = useState()
  let [height, setHeight] = useState()
  let [width, setWidth] = useState()
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload()

  let handleFileChange = async (file) => {
    let { url } = await uploadToS3(file)
    let { height, width } = await getImageData(file)
    setWidth(width)
    setHeight(height)
    setImageUrl(url)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Upload Files</title>
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
      </div>
    </div>
  )
}
