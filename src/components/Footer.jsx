export default function Footer(){
    return (
    <div className="flex flex-col py-5 px-5">
        <div className="flex text-s justify-center hover:text-indigo-800"><a href='https://github.com/bianxm/forkd-frontend' target="_blank" rel="noopener noreferrer"><img src='/src/assets/github-mark.png' className="w-5 h-5 inline mr-1 align-text-bottom"></img>Created by Bianca Matthews</a></div>
        <div className="flex text-xs items-center justify-center"><p className="text-center">Default avatars are public domain works by <a target="_blank" rel="noopener noreferrer" href='https://en.wikipedia.org/wiki/Fernando_Amorsolo' className="inline hover:text-indigo-800">Fernando Amorsolo</a></p></div>
        <div className="flex text-xs items-center justify-center"><p className="text-center">Logo adapted from icon made by <a target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/authors/iconbaandar" title="IconBaandar" className="inline hover:text-indigo-800"> IconBaandar </a> from <a target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon" className="inline hover:text-indigo-800">www.flaticon.com</a></p></div>
        <div className="flex text-xs items-center justify-center"><p className="text-center">Emoji patterns from <a target="_blank" rel="noopener noreferrer" href="https://emoji.supply/" className="hover:text-indigo-800">emoji.supply</a></p></div>
    </div>
    );
}