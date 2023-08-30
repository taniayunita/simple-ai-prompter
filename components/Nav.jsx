'use client'

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import Logo from '@public/assets/images/logo.svg'
import ImageProfile from '@public/assets/images/logo.svg'

const Nav = () => {

  const { data: session } = useSession()

  const isUserLoggedIn = true
  const [provider, setProvider] = useState(null)
  const [toggleDropDown, setToggleDropDown] = useState(false)

  useEffect(() => {
    const setUpProvider = async () => {
      const response = await getProviders()

      setProvider(response);
    }
    setUpProvider()
  }, [])

  return (
    <nav className="flex-between w-full mb-16 pt-3">
      <Link className="flex gap-2 flex-center" href="/">
        <Image src={Logo} alt="prompedia" width={30} height={30} className="object-contain" />
        <p className="logo_text">Prompedia</p>
      </Link>

      {/* desktop navigaiton */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link className="black_btn" href="/create-prompt">Create Post</Link>
            <button type="button" onClick={signOut} className="outline_btn"> Sign Out</button>
            <Link href="/profile">
              <Image src={session?.user.image} width={37} height={37} className="rounded-full" alt="profile" />
            </Link>
          </div>
        ) : (
          <>
            {provider && Object.values(provider).map((provider) => (
              <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className="black_btn"> Sign In</button>
            ))}
          </>
        )}
      </div>

      {/* mobile navigaiton */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image src={session?.user.image} width={37} height={37} className="rounded-full" alt="profile" onClick={() => setToggleDropDown((prev) => !prev)} />
            {toggleDropDown && (
              <div className="dropdown">
                <Link href="/profile" className="dropdown_link" onClick={() => setToggleDropDown(false)}>
                  My Profile
                </Link>
                <Link href="/create-prompt" className="dropdown_link" onClick={() => setToggleDropDown(false)}>
                  Create Prompt
                </Link>
                <button type="button" onClick={signOut} className="black_btn mt-5 w-full"> Sign Out</button>

              </div>
            )}
          </div>
        ) : (
          <>
            {provider && Object.values(provider).map((provider) => (
              <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className="black_btn"> Sign In</button>
            ))}
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav