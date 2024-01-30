import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export const downloadPdf = async () => {
  const todoListElement = document.getElementById("todo-list")

  if (todoListElement) {
    const canvas = await html2canvas(todoListElement, {
      scale: 4,
      useCORS: true
    })
    const imgData = canvas.toDataURL("image/jpeg", 1.0)

    // eslint-disable-next-line new-cap
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    })

    // Set margins
    const pdfWidth = 210 // A4 width in mm
    const pdfHeight = 297 // A4 height in mm
    const marginLeft = 10
    const marginTop = 20

    // Calculate the width and height of the image on the PDF
    const imgWidth = pdfWidth - marginLeft * 2 // Adjust the width of the image to account for margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Add the image to the PDF with margins
    pdf.addImage(imgData, "JPEG", marginLeft, marginTop, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      pdf.addPage()
      // The position for the next page is calculated from the bottom of the previous image
      const position = heightLeft - imgHeight

      pdf.addImage(imgData, "JPEG", marginLeft, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    pdf.save("todo-list.pdf")
  }
}
