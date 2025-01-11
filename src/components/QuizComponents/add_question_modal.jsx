import { h } from "preact";
import QuestionForm from "./question_form";

const AddQuestionModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <QuestionForm
                    onCancel={onClose}
                    onSave={() => {
                        console.log("Question saved");
                        onClose();
                    }}
                />
            </div>
        </div>
    );
};

export default AddQuestionModal;
