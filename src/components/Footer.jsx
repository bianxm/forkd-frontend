export default function Footer(){
    return (
    <div className="flex-col py-5">
        <div className="flex text-s justify-center hover:text-indigo-800"><a href='https://github.com/bianxm/forkd-frontend'><img src='/src/assets/github-mark.png' className="w-5 h-5 inline mr-1 align-text-bottom"></img>Created by Bianca Matthews</a></div>
        <div className="flex text-xs items-center justify-center">Default avatars are public domain works by <a href='https://en.wikipedia.org/wiki/Fernando_Amorsolo' className="ml-1 hover:text-indigo-800">Fernando Amorsolo</a></div>
        <div className="flex text-xs items-center justify-center"> Logo adapted from icon made by <a href="https://www.flaticon.com/authors/iconbaandar" title="IconBaandar" className="mx-1 hover:text-indigo-800"> IconBaandar </a> from <a href="https://www.flaticon.com/" title="Flaticon" className="ml-1 hover:text-indigo-800">www.flaticon.com</a></div>
        <div className="flex text-xs items-center justify-center"> Emoji patterns from <a href="https://emoji.supply/" className="ml-1 hover:text-indigo-800">emoji.supply</a></div>
    </div>
    );
}