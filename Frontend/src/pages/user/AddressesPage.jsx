/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import notify from "devextreme/ui/notify";
import { Button } from "devextreme-react/button";
import DataGrid, {
  Column,
  Editing,
  Paging,
  SearchPanel,
  LoadPanel,
} from "devextreme-react/data-grid";
import Form, {
  Item,
  RequiredRule,
  GroupItem,
  Label,
} from "devextreme-react/form";

import {
  createAddressApi,
  deleteAddressApi,
  getMyAddressesApi,
  setDefaultAddressApi,
} from "../../api/addressApi";

import "./AddressesPage.css";

const INITIAL_FORM_STATE = {
  fullName: "",
  phoneNumber: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nepal",
  isDefault: false,
};

export default function AddressesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE });

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyAddressesApi();
      setData(res.data?.data || res.data || []);
    } catch (e) {
      notify("Failed to load addresses", "error", 2000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    const result = e.validationGroup?.validate();
    if (!result || !result.isValid) return;

    setLoading(true);
    try {
      await createAddressApi(formData);

      notify("Address saved successfully", "success", 2000);

      setFormData({ ...INITIAL_FORM_STATE });
      load();
    } catch (err) {
      notify(
        err.response?.data?.message || "Check your network or server",
        "error",
        4000
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);

    try {
      await deleteAddressApi(deleteId);

      notify("Address deleted", "success", 2000);

      setShowDeleteModal(false);
      setDeleteId(null);

      load();
    } catch (err) {
      notify("Delete failed", "error", 2000);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="address-page">
      <div className="address-container">

        {/* LEFT FORM */}
        <div className="address-form-card">
          <h2 className="address-title">Add New Address</h2>

          <Form
            formData={formData}
            validationGroup="addressForm"
            onFieldDataChanged={(e) =>
              setFormData((prev) => ({
                ...prev,
                [e.dataField]: e.value,
              }))
            }
            labelLocation="top"
            colCount={2}
          >
            <GroupItem colSpan={2}>
              <Item dataField="fullName">
                <Label text="Full Name" />
                <RequiredRule />
              </Item>
            </GroupItem>

            <Item dataField="phoneNumber">
              <Label text="Phone Number" />
              <RequiredRule />
            </Item>

            <Item dataField="city">
              <Label text="City" />
              <RequiredRule />
            </Item>

            <GroupItem colSpan={2}>
              <Item dataField="line1">
                <Label text="Address Line 1" />
                <RequiredRule />
              </Item>

              <Item dataField="line2">
                <Label text="Address Line 2" />
              </Item>
            </GroupItem>

            <Item dataField="state">
              <Label text="State" />
              <RequiredRule />
            </Item>

            <Item dataField="postalCode">
              <Label text="Postal Code" />
              <RequiredRule />
            </Item>

            <Item
              dataField="country"
              editorType="dxSelectBox"
              editorOptions={{
                items: ["Nepal", "India", "USA"],
              }}
            >
              <Label text="Country" />
              <RequiredRule />
            </Item>

            <Item
              dataField="isDefault"
              editorType="dxCheckBox"
              label={{ text: "Set as default" }}
            />
          </Form>

          <Button
            width="100%"
            text={loading ? "Saving..." : "Save Address"}
            type="default"
            stylingMode="contained"
            validationGroup="addressForm"
            useSubmitBehavior={true}
            onClick={handleSubmit}
            className="address-save-btn"
            disabled={loading}
          />
        </div>

        {/* RIGHT GRID */}
        <div className="address-grid-card">
          <h2 className="address-title">Saved Addresses</h2>

          <DataGrid
            dataSource={data}
            keyExpr="id"
            showBorders={false}
            rowAlternationEnabled={true}
          >
            <LoadPanel enabled={loading} />
            <SearchPanel visible width={240} />
            <Paging defaultPageSize={6} />

            <Editing mode="row" allowDeleting={false} />

            <Column dataField="fullName" caption="Recipient" />
            <Column dataField="line1" caption="Address" />
            <Column dataField="city" caption="City" />

            <Column
              dataField="isDefault"
              caption="Status"
              width={100}
              cellRender={(cell) =>
                cell.value ? (
                  <span className="status-default">Default</span>
                ) : (
                  <span className="status-secondary">Secondary</span>
                )
              }
            />

            <Column
              type="buttons"
              width={120}
              buttons={[
                {
                  hint: "Set Default",
                  icon: "check",
                  visible: (e) => !e.row.data.isDefault,
                  onClick: async (e) => {
                    try {
                      await setDefaultAddressApi(e.row.data.id);
                      notify("Default Updated", "success", 1500);
                      load();
                    } catch {
                      notify("Update failed", "error", 2000);
                    }
                  },
                },
                {
                  hint: "Delete",
                  icon: "trash",
                  onClick: (e) => {
                    setDeleteId(e.row.data.id);
                    setShowDeleteModal(true);
                  },
                },
              ]}
            />
          </DataGrid>
        </div>
      </div>

      {/* ✅ CUSTOM DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Delete Address?</h3>
            <p className="modal-text">
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                disabled={deleting}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
              >
                No
              </button>

              <button
                className="btn-delete"
                disabled={deleting}
                onClick={confirmDelete}
              >
                {deleting ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}