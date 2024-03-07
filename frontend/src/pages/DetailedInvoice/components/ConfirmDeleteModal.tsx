import Button from "@src/components/Button";
import DialogWrapper from "@src/components/DialogWrapper";

type ConfirmDeleteProps = {
  invoice_tag: string;
  isOpen: boolean;
};

interface IConfirmDelete extends ConfirmDeleteProps {
  onCancel: () => void;
  onDelete: () => void;
}

export default function ConfirmDeleteModal(props: IConfirmDelete) {
  return (
    <DialogWrapper title="Confirm Deletion" isOpen={props.isOpen} onClose={() => {}}>
      <p className="text-[13px] text-custom-medium-grey mt-[8px] font-medium">Are you sure you want to delete invoice {props.invoice_tag}? This action cannot be undone.</p>

      <div className="flex flex-row items-center justify-end gap-2 mt-[22px]">
        <div className="w-[91px] h-[48px]">
          <Button onClick={props.onCancel} variant="secondary" text="Cancel" />
        </div>
        <div className="w-[89px] h-[48px]">
          <Button onClick={props.onDelete} variant="danger" text="Delete" />
        </div>
      </div>
    </DialogWrapper>
  );
}
