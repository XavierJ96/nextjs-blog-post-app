import Nav from './Nav'

// Children is all of the other components
export default function Layout({children}) {
    return(
        <div className='mx-14 flex justify-center items-center'>
            <div className="w-full max-w-2xl">
                {/* Nav will always be at the top */}
                <Nav />
                {/* Children will switch dynamically */}
                <main>{children}</main>
            </div>
        </div>
    )
}