export {auth as middleware} from '@/auth'

export const config = {
    matcher: [
        '/^((?!auth|api|_next/static|_next/image|.*\\.png$).*)'
    ],
};
