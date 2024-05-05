"use client";
import { FormSchema } from "@/validation";
import { registerUser } from "@/actions";
import Form, { FormRenderFunc, FormState } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Register() {
  const fields = [
    { name: 'name', type: 'text', label: 'Name' },
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'password', type: 'text', label: 'Password' },
    //{ name: 'confirm', type: 'checkbox', label: 'Confirm submit' }
  ];

  const buttons = [
    ({ isValid, pending }: FormState) => {
      console.log(isValid);
      console.log(pending);
      return <Button key="submit" type="submit" className="mt-3">Register user</Button>
    }
  ];

  /*const render: FormRenderFunc = ({ fields }) => 
    <>
      {fields.name}
      {fields.password}
    </>*/

  return (
    <>
      <Form
        fields={fields}
        validation={FormSchema.RegisterUser}
        buttons={buttons}
        action={registerUser}
      />
      <Card>
        <CardContent>
          aaaaa
        </CardContent>
      </Card>
    </>

  );
}
