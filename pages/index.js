import React, { useState } from 'react'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/client'
import { useS3Upload, getImageData } from 'next-s3-upload'

import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [session, loading] = useSession()
  const [imageUrl, setImageUrl] = useState()
  const [height, setHeight] = useState()
  const [width, setWidth] = useState()
  const { FileInput, openFileDialog, uploadToS3 } = useS3Upload()

  const handleFileChange = async (file) => {
    const { url } = await uploadToS3(file)
    const { height, width } = await getImageData(file)
    setWidth(width)
    setHeight(height)
    setImageUrl(url)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <React.Fragment>
      {!session && <button onClick={signIn}>Sign in</button>}
      {session && (
        <div className={styles.container}>
          <Head>
            <title>Upload Files</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <div>
            <button onClick={signOut}>Sign out</button>
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
      )}
    </React.Fragment>
  )
}
