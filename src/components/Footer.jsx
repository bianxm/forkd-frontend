export default function Footer(){
    return (
    <div className="flex-col py-5">
        <div className="flex text-s justify-center"><a href='https://github.com/bianxm/forkd-capstone'><img src='/src/assets/github-mark.png' className="w-5 h-5 inline mr-1 align-text-bottom"></img>Created by Bianca Matthews</a></div>
        <div className="flex text-xs items-center justify-center">Default avatars are public domain works by <a href='https://en.wikipedia.org/wiki/Fernando_Amorsolo' className="ml-1">Fernando Amorsolo</a></div>
        <div className="flex text-xs items-center justify-center"> Icons made by <a href="https://www.flaticon.com/authors/iconbaandar" title="IconBaandar" className="mx-1"> IconBaandar </a> from <a href="https://www.flaticon.com/" title="Flaticon" className="ml-1">www.flaticon.com</a></div>
    </div>
    );
}