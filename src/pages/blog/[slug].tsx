import { useRouter } from 'next/router'
 
const HalamanBlog = () => {
    const { query } = useRouter();
    return (    
        <div>
            <h1>Halaman Blog</h1> <br />
            <p>Slug : {query.slug}</p>
        </div>
    );
}

export default HalamanBlog;