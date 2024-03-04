import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function Editor({ value, onChange }: any) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { list: 'check' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link'],
        ],
        history: {
            delay: 1000,
            maxStack: 500,
            userOnly: true
        },
    };
    return (
        <div className="content bg-gray-200 my-4 mb-8 text-black">
            <ReactQuill
                value={value}
                onChange={onChange}
                modules={modules} />
        </div>
    );
}

