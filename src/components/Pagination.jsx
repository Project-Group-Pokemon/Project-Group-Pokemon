import React from 'react';

const Pagination = ({ currentPage, totalPages, onPrev, onNext, onFirst, onLast, onPageChange }) => {
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageButtons = 3; // Jumlah halaman yang ditampilkan

        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = startPage + maxPageButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex flex-col items-center mt-6 space-y-4">
            <div className="flex justify-center items-center space-x-4">
                {/* Tombol First dan Prev hanya ditampilkan jika bukan di halaman pertama */}
                {currentPage !== 1 && (
                    <>
                        <button
                            onClick={onFirst}
                            className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            First
                        </button>

                        <button
                            onClick={onPrev}
                            className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Prev
                        </button>
                    </>
                )}

                {/* Nomor Halaman */}
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-2 rounded ${page === currentPage
                                ? 'bg-blue-700 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Tombol Next dan Last hanya ditampilkan jika bukan di halaman terakhir */}
                {currentPage !== totalPages && (
                    <>
                        <button
                            onClick={onNext}
                            className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Next
                        </button>

                        <button
                            onClick={onLast}
                            className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Last
                        </button>
                    </>
                )}
            </div>

            {/* Teks dibawah navigasi */}
            <span className="text-gray-700">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
};

export default Pagination;
