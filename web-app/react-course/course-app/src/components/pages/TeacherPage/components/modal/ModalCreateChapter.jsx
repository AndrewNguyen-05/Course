const ModalCreateChapter = (props) => {

    const {
        chapterName,
        setChapterName,
        description,
        setDescription,
        onClose,
        handleCreateChapter
    } = props;

    return (
        <div className="create-chapter-modal">
            <div className="create-chapter-modal-content">
                <span className="create-chapter-modal-close" onClick={onClose}>&times;</span>
                <h2>Create New Chapter</h2>
                <form>
                    <div className="create-chapter-input-group">
                        <label>Chapter Name:</label>
                        <input
                            type="text"
                            value={chapterName}
                            onChange={(e) => setChapterName(e.target.value)}
                            placeholder="Enter chapter name"
                            required
                        />
                    </div>
                    <div className="create-chapter-input-group">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter chapter description"
                            required
                        ></textarea>
                    </div>
                    <div className="create-chapter-actions">
                        <button type="button" className="create-chapter-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="button" className="create-chapter-btn-save" onClick={handleCreateChapter}>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ModalCreateChapter;
