import { useEffect, useRef, useState } from "react";
import "./listStudents.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faSort } from "@fortawesome/free-solid-svg-icons";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { TableRowSelection } from "antd/es/table/interface";
import { Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { HeaderWeb } from "../../HeaderWeb";
import NotificationPopup from "../../Notification";
import StudentFooterActions from "../../FooterWeb";
import RowWrap from "../../../Components/RowWrap";
import ColWrap from "../../../Components/ColWrap";
import { CustomButton } from "../../../Components/buttons/CustomButton";
import FormWrap from "../../../Components/Form/FormWrap";
import { FormInputSearch } from "../../../Components/Form/FormInputSearch";
import { FormButtonSubmit } from "../../../Components/Form/FormButtonSubmit";
import { SvgMagnifyingGlassSubmit } from "../../../Components/@svg/SvgMagnifyingGlassSubmit";
import TableWrap from "../../../Components/TableWrap";
import { CUSTOMER_ROUTER_PATH } from "../../../Routers/Routers";
import { FormInput } from "../../../Components/Form/FormInput";
import { FormSelect } from "../../../Components/Form/FormSelect";
enum classSelector {
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
}
enum classCodeSelector {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}
enum genderType {
  NAM = "Nam",
  NỮ = "Nữ",
}
enum courseSelect {
  Year_2024_2025 = "K21",
  Year_2025_2026 = "K22",
  Year_2026_2027 = "K23",
  Year_2027_2028 = "K24",
}
enum stateSelector {
  ON_STUDY = "Đang học",
  OUT_STUDY = "Nghỉ học",
  GRADUATE = "Tốt nghiệp",
  RESERVED = "Bảo lưu",
}

export const ListStudents = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = useForm();
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const classOption = Object.values(classSelector).map((major) => ({
    label: major,
    value: major,
  }));
  const classCodeOption = Object.values(classCodeSelector).map((major) => ({
    label: major,
    value: major,
  }));
  const courseOption = Object.values(courseSelect).map((major) => ({
    label: major,
    value: major,
  }));
  const genderOption = Object.values(genderType).map((major) => ({
    label: major,
    value: major,
  }));
  const stateOption = Object.values(stateSelector).map((course) => ({
    label: course,
    value: course,
  }));
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [editState, setEditState] = useState<boolean>(true);
  const [modalStates, setModalStates] = useState({
    editModal: false,
    deleteModal: false,
    addModal: false,
    addStudent: false,
    showDeleteButton: false,
    showEditButton: false,
    showNewColumn: false,
    showRegistedNewColumn: false,
    showEditstudent: false,
  });

  const conlumns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => {
        return (
          <p style={{ color: "black", fontWeight: "600" }}>{record.key}</p>
        );
      },
    },
    {
      title: "MÃ HỌC SINH",
      dataIndex: "studentMsv",
      key: "studentsMsv",
      render: (record) => {
        return (
          <>
            <p className="list-student_data-studentsMsv">{record}</p>
          </>
        );
      },
    },
    {
      title: "HỌ VÀ TÊN",
      dataIndex: "studentName",
      key: "studentName",
      render: (record) => {
        return (
          <>
            <p className="list-student_data-studentName">{record}</p>
          </>
        );
      },
    },
    {
      title: "LỚP",
      dataIndex: "studentClass",
      key: "studentClass",
      render: (record) => {
        return (
          <>
            <p className="list-student_data-studentClass">{record}</p>
          </>
        );
      },
      filterIcon: <FontAwesomeIcon icon={faSort} />,
      filters: classOption,
      onFilter: (value, record) => record.studentClass.includes(value),
    },
    {
      title: "MÃ LỚP",
      dataIndex: "studentClassCode",
      key: "studentClassCode",
      render: (record) => {
        return (
          <>
            <p className="list-student_data-studentClass">{record}</p>
          </>
        );
      },
      filterIcon: <FontAwesomeIcon icon={faSort} />,
      filters: classCodeOption,
      onFilter: (value, record) => record.studentClassCode.includes(value),
    },
    {
      title: "KHÓA",
      dataIndex: "studentCourse",
      key: "studentCourse",
      render: (record) => {
        return (
          <>
            <p className="list-student_data-studentCourse">{record}</p>
          </>
        );
      },
      filterIcon: <FontAwesomeIcon icon={faSort} />,
      filters: courseOption,
      onFilter: (value, record) => record.studentCourse.includes(value),
    },
    {
      title: "NGÀY SINH",
      dataIndex: "studentDob",
      key: "studentDob",
      render: (record) => {
        return (
          <>
            <p className="m-0 list-student_data-studentDob">{record}</p>
          </>
        );
      },
    },
    {
      title: "GIỚI TÍNH",
      dataIndex: "studentGender",
      key: "studentGender",
      render: (record) => {
        return (
          <>
            <p className="list-student_data-studentGender">{record}</p>
          </>
        );
      },
      filterIcon: <FontAwesomeIcon icon={faSort} />,
      filters: genderOption,
      onFilter: (value, record) => record.studentGender.includes(value),
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "studentState",
      key: "studentState",
      render: (record) => {
        const stateDisplay = stateOption.find(
          (option) => option.value === record
        )?.label;
        const stateClass = `list-student_data-studentState ${
          stateDisplay ? stateDisplay.toLowerCase().replace(/\s+/g, "-") : ""
        }`;
        return (
          <>
            <p className={stateClass}>{stateDisplay || record}</p>
          </>
        );
      },
      filterIcon: <FontAwesomeIcon icon={faSort} />,
      filters: stateOption,
      onFilter: (value, record) => record.studentState.includes(value),
    },
    {
      title: "CHI TIẾT",
      dataIndex: "studentOption",
      key: "studentOption",
      render: () => {
        return (
          <>
            <CustomButton
              content="Chi tiết"
              buttonProps={{
                className: "list-student_data-studentOption",
                icon: <FontAwesomeIcon icon={faCircleInfo} />,
                disabled: !editState,
                onClick: () => {
                  navigate(CUSTOMER_ROUTER_PATH.STUDENT_INFORMATION);
                },
              }}
            />
          </>
        );
      },
    },
    {
      title: "CHỨC NĂNG",
      dataIndex: "cn",
      key: "cn",
      render: (text, record) => {
        return (
          <>
            {modalStates.showEditButton && (
              <CustomButton
                content="Sửa"
                buttonProps={{
                  onClick: () => {
                    setSelectedRecord(record);
                    setModalStates({
                      ...modalStates,
                      editModal: true,
                    });
                  },
                  icon: <EditOutlined />,
                  className: "list-student_footer-editTable",
                }}
              />
            )}
            {modalStates.showDeleteButton && (
              <CustomButton
                content="Xóa"
                buttonProps={{
                  icon: <DeleteOutlined />,
                  onClick: () => {
                    setModalStates({
                      ...modalStates,
                      deleteModal: true,
                    });
                  },
                  className: "list-student_footer-delete",
                }}
              />
            )}
          </>
        );
      },

      hidden: !modalStates.showRegistedNewColumn,
    },
  ];
  const [data, setNewData] = useState<any[]>([
    {
      id: "1",
      key: "1",
      studentMsv: "21A100100373",
      studentName: "Trịnh Đức Thưởng",
      studentClass: "8",
      studentClassCode: "A",
      studentCourse: "K21",
      studentDob: "28/07/2003",
      studentGender: "Nam",
      studentState: "Đang học",
      studentOption: "Details",
    },
    {
      id: "2",
      key: "2",
      studentMsv: "21A100100140",
      studentName: "Lương Thu Hoài",
      studentClass: "6",
      studentClassCode: "B",
      studentCourse: "K21",
      studentDob: "1/10/2003",
      studentGender: "Nữ",
      studentState: "Đang học",
      studentOption: "Details",
    },
    {
      id: "3",
      key: "3",
      studentMsv: "21A100100137",
      studentName: "Nguyễn Minh Hòa",
      studentClass: "7",
      studentClassCode: "C",
      studentCourse: "K21",
      studentDob: "15/11/2003",
      studentGender: "Nữ",
      studentState: "Tốt nghiệp",
      studentOption: "Details",
    },
    {
      id: "4",
      key: "4",
      studentMsv: "21A100100331",
      studentName: "Nguyễn Minh Tuấn",
      studentClass: "9",
      studentClassCode: "D",
      studentCourse: "K21",
      studentDob: "15/01/2003",
      studentGender: "Nam",
      studentState: "Bảo lưu",
      studentOption: "Details",
    },
    {
      id: "5",
      key: "5",
      studentMsv: "21A100100337",
      studentName: "Trần Minh Thư",
      studentClass: "8",
      studentClassCode: "A",
      studentCourse: "K21",
      studentDob: "25/11/2003",
      studentGender: "Nữ",
      studentState: "Nghỉ học",
      studentOption: "Details",
    },
    {
      id: "6",
      key: "6",
      studentMsv: "21A100100327",
      studentName: "Trần Minh Tuấn",
      studentClass: "6",
      studentClassCode: "D",
      studentCourse: "K21",
      studentDob: "25/5/2003",
      studentGender: "Nam",
      studentState: "Nghỉ học",
      studentOption: "Details",
    },
    {
      id: "7",
      key: "7",
      studentMsv: "21A100100344",
      studentName: "Trịnh Văn Mạnh",
      studentClass: "9",
      studentClassCode: "C",
      studentCourse: "K21",
      studentDob: "25/11/2003",
      studentGender: "Nam",
      studentState: "Đang học",
      studentOption: "Details",
    },
    {
      id: "8",
      key: "8",
      studentMsv: "21A100100437",
      studentName: "Hoàng Bảo Ngọc",
      studentClass: "8",
      studentClassCode: "A",
      studentCourse: "K21",
      studentDob: "03/02/2003",
      studentGender: "Nữ",
      studentState: "Đang học",
      studentOption: "Details",
    },
    {
      id: "9",
      key: "9",
      studentMsv: "21A100100537",
      studentName: "Trần Khánh Hùng",
      studentClass: "7",
      studentClassCode: "B",
      studentCourse: "K21",
      studentDob: "25/11/2003",
      studentGender: "Nam",
      studentState: "Đang học",
      studentOption: "Details",
    },
    {
      id: "10",
      key: "10",
      studentMsv: "21A100100347",
      studentName: "Phạm Duy Trường",
      studentClass: "7",
      studentClassCode: "A",
      studentCourse: "K21",
      studentDob: "25/11/2003",
      studentGender: "Nam",
      studentState: "Tốt nghiệp",
      studentOption: "Details",
    },
  ]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const handleExportExcel = () => {
    const selectedData = data.filter((_, index) =>
      selectedRowKeys.includes(data[index].id)
    );

    const headers = [
      { header: "STT", key: "key" },
      { header: "Mã học sinh", key: "studentMsv" },
      { header: "Họ và Tên", key: "studentName" },
      { header: "Lớp", key: "studentClass" },
      { header: "Khóa", key: "studentCourse" },
      { header: "Ngày Sinh", key: "studentDob" },
      { header: "Giới Tính", key: "studentGender" },
      { header: "Trạng Thái", key: "studentState" },
      { header: "Chi Tiết", key: "studentOption" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(selectedData, {
      header: headers.map((h) => h.key),
    });
    const workbook = XLSX.utils.book_new();
    headers.forEach((h, index) => {
      const cellAddress = XLSX.utils.encode_cell({ c: index, r: 0 });
      worksheet[cellAddress].v = h.header;
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, "StudentsList");
    XLSX.writeFile(workbook, "DanhSachSinhVien.xlsx");
  };
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (selectedRecord) {
      form.setFieldsValue({
        studentMsv: selectedRecord.studentMsv,
        studentName: selectedRecord.studentName,
        studentState: selectedRecord.studentState,
        studentClass: selectedRecord.studentClass,
        studentClassCode: selectedRecord.studentClassCode,
        studentCourse: selectedRecord.studentCourse,
        studentDob: selectedRecord.studentDob,
        studentGender: selectedRecord.studentGender,
      });
    }
  }, [selectedRecord, form]);
  useEffect(() => {
    const handleTableScroll = () => {
      if (tableWrapperRef.current && scrollRef.current) {
        scrollRef.current.scrollLeft = tableWrapperRef.current.scrollLeft;
      }
    };

    const handleDivScroll = () => {
      if (tableWrapperRef.current && scrollRef.current) {
        tableWrapperRef.current.scrollLeft = scrollRef.current.scrollLeft;
      }
    };

    if (tableWrapperRef.current && scrollRef.current) {
      tableWrapperRef.current.addEventListener("scroll", handleTableScroll);
      scrollRef.current.addEventListener("scroll", handleDivScroll);
    }
    return () => {
      if (tableWrapperRef.current && scrollRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        tableWrapperRef.current.removeEventListener(
          "scroll",
          handleTableScroll
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollRef.current.removeEventListener("scroll", handleDivScroll);
      }
    };
  }, []);

  return (
    <div className="list-student">
      <HeaderWeb name="QUẢN LÝ HỌC SINH" disAble={true} />
      <NotificationPopup
        message={notification?.message}
        type={notification?.type}
      />
      <div className="list-student_header">
        <h1 className="list-student_header-title">Danh sách học sinh</h1>
        <p className="list-student_header-sub">
          Trang này hiển thị thông tin liên quan đến thông tin học sinh{" "}
        </p>
      </div>
      <div className="list-student_content">
        <div className="list-student_sidebar" ref={scrollRef}>
          <RowWrap
            isGutter={true}
            isWrap={true}
            isAutoFillRow={true}
            styleFill={"between"}
            gutter={[16, 16]}
            className="list-student_sidebar-scroll"
          >
            <FormWrap
              className="list-student_sidebar-colRight-formSearch"
              name="search-product"
              layout={"inline"}
              initialValues={{
                select: "Dữ liệu",
              }}
              onFinish={() => {}}
            >
              <FormInputSearch
                name={"fullrecordSearch"}
                isShowIcon={false}
                formItemProps={{
                  className: "list-student_sidebar-colRight-formSearch-input",
                }}
                inputProps={{
                  placeholder: "Mã học sinh",
                }}
              />
              <FormButtonSubmit
                content={<SvgMagnifyingGlassSubmit />}
                formItemProps={{
                  className: "list-student_sidebar-colRight-formSearch-button",
                }}
              />
            </FormWrap>
          </RowWrap>
        </div>
        <div className="list-student_table">
          <TableWrap
            setSize={() => {}}
            scrollValue={{ x: 1366 }}
            tableWidth={1416}
            rootClassName="list-student_table-wrap"
            tableWrapperRef={tableWrapperRef}
            tableProps={{
              columns: conlumns.map((column) => ({
                ...column,
                filters: column.filters?.map((filter) => ({
                  ...filter,
                  text: filter.label,
                })),
              })),
              dataSource: data,
              rowSelection: rowSelection,
            }}
          />
        </div>

        <StudentFooterActions
          editState={editState}
          setEditState={setEditState}
          modalStates={modalStates}
          setModalStates={setModalStates}
          handleExportExcel={handleExportExcel}
          disAble={!hasSelected}
          shouldScroll={false}
          isPrint={true}
          isShowOption={true}
          isExport={true}
          add={true}
        />
        <div className="list-student_modal-popup">
          {/* Modal Add */}
          <Modal
            className="list-student_modal-add"
            open={modalStates.addModal}
            onCancel={() => {
              setModalStates({
                ...modalStates,
                addModal: false,
              });
            }}
            onOk={() => {
              setModalStates({
                ...modalStates,
                addModal: false,
                addStudent: true,
              });
            }}
          >
            <h1 className="list-student_modal-header">
              Bạn muốn thêm một học sinh?
            </h1>
            <div className="list-student_underLine" />
          </Modal>
          {/* Modal Delete */}
          <Modal
            className="list-student_modal-delete"
            open={modalStates.deleteModal}
            onCancel={() => {
              setModalStates({
                ...modalStates,
                showDeleteButton: true,
                deleteModal: false,
              });
            }}
            onOk={() => {}}
          >
            <h1 className="list-student_modal-header">
              Bạn muốn xóa học sinh này ?
            </h1>
            <div className="list-student_underLine" />
          </Modal>
          {/* Modal Edit */}
          <Modal
            className="list-student_modal-edit"
            open={modalStates.editModal}
            onCancel={() => {
              setModalStates({
                ...modalStates,
                editModal: false,
                showEditButton: true,
              });
            }}
            onOk={() => {
              setModalStates({
                ...modalStates,
                showEditstudent: true,
                editModal: false,
              });
            }}
          >
            <h1 className="list-student_modal-header">
              Bạn muốn sửa thông tin học sinh này ?
            </h1>
            <div className="list-student_underLine" />
          </Modal>
          {/* Modal Add Student */}
          <Modal
            className="list-student_modal-addStudent"
            open={modalStates.addStudent}
            onCancel={() => {
              setModalStates({
                ...modalStates,
                addStudent: false,
              });
            }}
            onOk={() => {
              if (
                form.getFieldValue("studentMsv") &&
                form.getFieldValue("studentName") &&
                form.getFieldValue("studentClass") &&
                form.getFieldValue("studentClassCode") &&
                form.getFieldValue("studentCourse") &&
                form.getFieldValue("studentDob") &&
                form.getFieldValue("studentGender") &&
                form.getFieldValue("studentState")
              ) {
                const newData = {
                  key: data.length + 1,
                  studentMsv: form.getFieldValue("studentMsv"),
                  studentName: form.getFieldValue("studentName"),
                  studentClass: form.getFieldValue("studentClass"),
                  studentClassCode: form.getFieldValue("studentClassCode"),
                  studentCourse: form.getFieldValue("studentCourse"),
                  studentDob: form.getFieldValue("studentDob"),
                  studentGender: form.getFieldValue("studentGender"),
                  studentState: form.getFieldValue("studentState"),
                };
                setNewData([...data, newData]);
                setModalStates({
                  ...modalStates,
                  addStudent: false,
                });
              } else {
                setNotification({
                  message: "Vui lòng điền đầy đủ dữ liệu",
                  type: "error",
                });
              }
            }}
            afterClose={() => {
              form.resetFields();
            }}
          >
            <h1 className="list-student_modal-header">THÊM HỌC SINH</h1>
            <div className="list-student_underLine" />
            <div className="list-student_modal-addStudent-content">
              <FormWrap form={form} className="list-student_form">
                {/* Hàng 1 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[8, 8]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">HỌ VÀ TÊN</p>
                    <FormInput
                      name={"studentName"}
                      formItemProps={{
                        className: "list-student_form-studentName",
                      }}
                      inputProps={{
                        placeholder: "Họ và tên",
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">TRẠNG THÁI</p>
                    <FormSelect
                      name={"studentState"}
                      formItemProps={{
                        className: "list-student_form-studentMsv",
                      }}
                      placeholder="Trạng thái"
                      selectProps={{
                        options: stateOption,
                      }}
                    />
                  </ColWrap>
                </RowWrap>
                {/* Hàng 2 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[12, 12]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">MÃ HỌC SINH</p>
                    <FormInput
                      name={"studentMsv"}
                      formItemProps={{
                        className: "list-student_form-studentClass",
                      }}
                      inputProps={{
                        placeholder: "Mã học sinh",
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">KHÓA</p>
                    <FormInput
                      name={"studentCourse"}
                      formItemProps={{
                        className: "list-student_form-studentDob",
                      }}
                      inputProps={{
                        placeholder: "Khóa",
                      }}
                    />
                  </ColWrap>
                </RowWrap>
                {/* Hàng 3 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[12, 12]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">LỚP</p>
                    <FormSelect
                      name={"studentClass"}
                      formItemProps={{
                        className: "list-student_form-studentID",
                      }}
                      placeholder="Lớp"
                      selectProps={{
                        options: classOption,
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">MÃ LỚP</p>
                    <FormSelect
                      name={"studentClassCode"}
                      formItemProps={{
                        className: "list-student_form-studentID",
                      }}
                      placeholder="Mã lớp"
                      selectProps={{
                        options: classCodeOption,
                      }}
                    />
                  </ColWrap>
                </RowWrap>
                {/* Hàng 4 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[12, 12]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">NGÀY SINH</p>
                    <FormInput
                      name={"studentDob"}
                      formItemProps={{
                        className: "list-student_form-studentEmail",
                      }}
                      inputProps={{
                        placeholder: "Ngày sinh",
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">GIỚI TÍNH</p>
                    <FormSelect
                      name={"studentGender"}
                      formItemProps={{
                        className: "list-student_form-studentID",
                      }}
                      placeholder="Giới tính"
                      selectProps={{
                        options: genderOption,
                      }}
                    />
                  </ColWrap>
                </RowWrap>
              </FormWrap>

              <div className="list-student_underLine" />
            </div>
          </Modal>
          {/* Modal Edit student */}
          <Modal
            className="list-student_modal-editStudent"
            open={modalStates.showEditstudent}
            onCancel={() => {
              setModalStates({
                ...modalStates,
                showEditstudent: false,
              });
            }}
            onOk={() => {
              if (
                form.getFieldValue("studentMsv") &&
                form.getFieldValue("studentName") &&
                form.getFieldValue("studentState") &&
                form.getFieldValue("studentClass") &&
                form.getFieldValue("studentCourse") &&
                form.getFieldValue("studentDob") &&
                form.getFieldValue("studentState") &&
                form.getFieldValue("studentGender")
              ) {
                const newCourse = {
                  ...selectedRecord,
                  studentName: form.getFieldValue("studentName"),
                  studentMsv: form.getFieldValue("studentMsv"),
                  studentClassCode: form.getFieldValue("studentClassCode"),
                  studentClass: form.getFieldValue("studentClass"),
                  studentCourse: form.getFieldValue("studentCourse"),
                  studentDob: form.getFieldValue("studentDob"),
                  studentState: form.getFieldValue("studentState"),
                  studentGender: form.getFieldValue("studentGender"),
                };

                setNewData(
                  data.map((course) =>
                    course.key === selectedRecord.key ? newCourse : course
                  )
                );
                setModalStates({
                  ...modalStates,
                  showEditstudent: false,
                });
              } else {
                setNotification({
                  message: "Vui lòng điền đầy đủ dữ liệu",
                  type: "error",
                });
              }
            }}
            afterClose={() => {
              form.resetFields();
            }}
          >
            <h1 className="list-student_modal-header">
              SỬA THÔNG TIN HỌC SINH
            </h1>
            <div className="list-student_underLine" />
            <div className="list-student_modal-addStudent-content">
              <FormWrap form={form} className="list-student_form">
                {/* Hàng 1 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[8, 8]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">HỌ VÀ TÊN</p>
                    <FormInput
                      name={"studentName"}
                      formItemProps={{
                        className: "list-student_form-studentName",
                      }}
                      inputProps={{
                        placeholder: "Họ và tên",
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">MÃ HỌC SINH</p>
                    <FormInput
                      name={"studentMsv"}
                      formItemProps={{
                        className: "list-student_form-studentClass",
                      }}
                      inputProps={{
                        placeholder: "Mã học sinh",
                      }}
                    />
                  </ColWrap>
                </RowWrap>
                {/* Hàng 2 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[12, 12]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">TRẠNG THÁI</p>
                    <FormSelect
                      name={"studentState"}
                      formItemProps={{
                        className: "list-student_form-studentMsv",
                      }}
                      placeholder="Trạng thái"
                      selectProps={{
                        options: stateOption,
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">KHÓA</p>
                    <FormInput
                      name={"studentCourse"}
                      formItemProps={{
                        className: "list-student_form-studentDob",
                      }}
                      inputProps={{
                        placeholder: "Khóa",
                      }}
                    />
                  </ColWrap>
                </RowWrap>
                {/* Hàng 3 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[12, 12]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">LỚP</p>
                    <FormSelect
                      name={"studentClass"}
                      formItemProps={{
                        className: "list-student_form-studentID",
                      }}
                      placeholder="Lớp"
                      selectProps={{
                        options: classOption,
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">MÃ LỚP</p>
                    <FormSelect
                      name={"studentClassCode"}
                      formItemProps={{
                        className: "list-student_form-studentDob",
                      }}
                      placeholder="Mã lớp"
                      selectProps={{
                        options: classCodeOption,
                      }}
                    />
                  </ColWrap>
                </RowWrap>
                {/* Hàng 4 */}
                <RowWrap
                  isGutter={true}
                  isWrap={true}
                  isAutoFillRow={true}
                  styleFill={"between"}
                  gutter={[12, 12]}
                  className="list-student_modal-row"
                >
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">NGÀY SINH</p>
                    <FormInput
                      name={"studentDob"}
                      formItemProps={{
                        className: "list-student_form-studentEmail",
                      }}
                      inputProps={{
                        placeholder: "Ngày sinh",
                      }}
                    />
                  </ColWrap>
                  <ColWrap colProps={{ span: 12 }}>
                    <p className="list-student_row-label">GIỚI TÍNH</p>
                    <FormSelect
                      name={"studentGender"}
                      formItemProps={{
                        className: "list-student_form-studentNumber",
                      }}
                      placeholder="Giới tính"
                      selectProps={{
                        options: genderOption,
                      }}
                    />
                  </ColWrap>
                </RowWrap>
              </FormWrap>
              <div className="list-student_underLine" />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};
