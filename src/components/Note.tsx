

interface NoteProps {
    variant: 'error' | 'success';
    children: React.ReactNode;
}


const Note = ({ variant, children }: NoteProps) => {
    let variantClasses = '';

    switch (variant) {
        case 'error':
            variantClasses = 'bg-red-200 text-red-600';
            break;
        case 'success':
            variantClasses = 'bg-green-200 text-green-600';
    }

    return (
        <div
            className={`mr-auto flex items-center px-4 py-2 font-goodHeadlineMedium ${variantClasses}`}
        >
            {children}
        </div>
    );
};

export default Note;