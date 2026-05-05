/* eslint-disable no-irregular-whitespace */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
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
  }, [load]); // ✅ CLEAN VALIDATION HANDLING

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
      const errorMsg =
        err.response?.data?.message || "Check your network or server";
      notify(errorMsg, "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
    try {
      await deleteAddressApi(e.data.id);
      notify("Address deleted", "success", 2000);
      load();
    } catch (err) {
      e.cancel = true;
      notify("Delete failed", "error", 2000);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8">
                  {/* LEFT SIDE: FORM */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Add New Address
          </h2>
                     {" "}
          <Form
            formData={formData}
            validationGroup="addressForm" // ✅ IMPORTANT
            onFieldDataChanged={(e) => {
              setFormData((prev) => ({
                ...prev,
                [e.dataField]: e.value,
              }));
            }}
            labelLocation="top"
            showColonAfterLabel={false}
            colCount={2}
          >
            <GroupItem colSpan={2}>
              <Item dataField="fullName">
                <Label text="Full Name" />
                <RequiredRule message="Full name is required" />
              </Item>
            </GroupItem>
                         {" "}
            <Item dataField="phoneNumber">
              <Label text="Phone Number" />
              <RequiredRule message="Required" />
            </Item>
                         {" "}
            <Item dataField="city">
              <Label text="City" />
              <RequiredRule message="Required" />
            </Item>
                         {" "}
            <GroupItem colSpan={2}>
              <Item dataField="line1">
                <Label text="Address Line 1" />
                <RequiredRule message="Required" />
              </Item>
              <Item dataField="line2">
                <Label text="Address Line 2 (Optional)" />
              </Item>
            </GroupItem>
                         {" "}
            <Item dataField="state">
              <Label text="State" />
              <RequiredRule message="Required" />
            </Item>
                         {" "}
            <Item dataField="postalCode">
              <Label text="Postal Code" />
              <RequiredRule message="Required" />
            </Item>
                         {" "}
            <Item
              dataField="country"
              editorType="dxSelectBox"
              editorOptions={{
                items: ["Nepal", "India", "USA"],
                searchEnabled: true,
              }}
            >
              <Label text="Country" />
              <RequiredRule message="Required" />
            </Item>
                         {" "}
            <Item
              dataField="isDefault"
              editorType="dxCheckBox"
              label={{ text: "Set as default" }}
            />
          </Form>
                      {/* ✅ CORRECT BUTTON */}
          <Button
            width="100%"
            text={loading ? "Saving..." : "Save Address"}
            type="default"
            stylingMode="contained"
            validationGroup="addressForm" // ✅ IMPORTANT
            useSubmitBehavior={true} // ✅ IMPORTANT
            onClick={handleSubmit}
            className="mt-6 bg-blue-600! text-white! rounded-lg py-3 shadow-md font-semibold"
            disabled={loading}
          />
        </div>
                  {/* RIGHT SIDE: DATA GRID */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
                        Saved Addresses
          </h2>
                     {" "}
          <DataGrid
            dataSource={data}
            keyExpr="id"
            showBorders={false}
            onRowRemoving={handleDelete}
            rowAlternationEnabled={true}
          >
            <LoadPanel enabled={loading} />
            <SearchPanel visible={true} width={240} />
            <Paging defaultPageSize={6} />
            <Editing mode="row" allowDeleting={true} useIcons={true} />
                          <Column dataField="fullName" caption="Recipient" />
            <Column dataField="line1" caption="Address" />
            <Column dataField="city" caption="City" />             {" "}
            <Column
              dataField="isDefault"
              caption="Status"
              width={100}
              cellRender={(cell) =>
                cell.value ? (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded-full font-bold uppercase tracking-wider">
                                        Default
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs italic">
                                        Secondary
                  </span>
                )
              }
            />
                         {" "}
            <Column
              type="buttons"
              width={110}
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
                "delete",
              ]}
            />
          </DataGrid>
        </div>
      </div>
    </div>
  );
}
