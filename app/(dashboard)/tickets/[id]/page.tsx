interface UrlParams {
    id: number;
}

interface PageParams {
    params: Promise<UrlParams>
}

export default async function Page({params}: PageParams) {
    const {id} = await params

    return <div>My Post: {id}</div>
}
